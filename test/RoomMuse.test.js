const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RoomMuse Smart Contract", function () {
  let RoomMuse;
  let roomMuse;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    RoomMuse = await ethers.getContractFactory("RoomMuse");
    roomMuse = await RoomMuse.deploy();
    await roomMuse.waitForDeployment();
  });

  describe("Deployment & Initial State", function () {
    it("should initialize with zero rooms and zero likes", async function () {
      const [activeRooms, totalLikes, totalPublished] = await roomMuse.getPlatformStats();
      expect(activeRooms).to.equal(0n);
      expect(totalLikes).to.equal(0n);
      expect(totalPublished).to.equal(0n);

      const allRooms = await roomMuse.getAllRooms();
      expect(allRooms.length).to.equal(0);
    });
  });

  describe("Publishing Rooms", function () {
    it("should publish a room successfully and emit RoomPublished event", async function () {
      const tx = await roomMuse.connect(user1).publishRoom(
        "Modern Japandi Sanctuary",
        "A quiet, balanced aesthetic combining Japanese minimalism and Scandinavian warmth.",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
        "Living Room",
        "Open Concept Living"
      );

      const receipt = await tx.wait();
      const parsedLogs = receipt.logs
        .map((log) => {
          try {
            return roomMuse.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const publishedEvent = parsedLogs.find((l) => l.name === "RoomPublished");
      expect(publishedEvent).to.not.be.undefined;
      expect(publishedEvent.args.roomId).to.equal(1n);
      expect(publishedEvent.args.author).to.equal(user1.address);
      expect(publishedEvent.args.title).to.equal("Modern Japandi Sanctuary");
      expect(publishedEvent.args.category).to.equal("Living Room");
      expect(publishedEvent.args.roomType).to.equal("Open Concept Living");

      const [activeRooms, totalLikes, totalPublished] = await roomMuse.getPlatformStats();
      expect(activeRooms).to.equal(1n);
      expect(totalPublished).to.equal(1n);

      const room = await roomMuse.getRoom(1);
      expect(room.id).to.equal(1n);
      expect(room.author).to.equal(user1.address);
      expect(room.title).to.equal("Modern Japandi Sanctuary");
      expect(room.category).to.equal("Living Room");
      expect(room.roomType).to.equal("Open Concept Living");
      expect(room.likes).to.equal(0n);
      expect(room.exists).to.be.true;
    });

    it("should reject room publication with empty fields", async function () {
      let reverted1 = false;
      try {
        await roomMuse.publishRoom("", "Desc", "https://img.com", "Bedroom", "Suite");
      } catch (err) {
        reverted1 = true;
        expect(err.message).to.include("RoomMuse: Title cannot be empty");
      }
      expect(reverted1, "Empty title should revert").to.be.true;

      let reverted2 = false;
      try {
        await roomMuse.publishRoom("Title", "Desc", "", "Bedroom", "Suite");
      } catch (err) {
        reverted2 = true;
        expect(err.message).to.include("RoomMuse: Image URL cannot be empty");
      }
      expect(reverted2, "Empty image URL should revert").to.be.true;

      let reverted3 = false;
      try {
        await roomMuse.publishRoom("Title", "Desc", "https://img.com", "", "Suite");
      } catch (err) {
        reverted3 = true;
        expect(err.message).to.include("RoomMuse: Category cannot be empty");
      }
      expect(reverted3, "Empty category should revert").to.be.true;

      let reverted4 = false;
      try {
        await roomMuse.publishRoom("Title", "Desc", "https://img.com", "Bedroom", "");
      } catch (err) {
        reverted4 = true;
        expect(err.message).to.include("RoomMuse: Room type cannot be empty");
      }
      expect(reverted4, "Empty room type should revert").to.be.true;
    });
  });

  describe("Liking and Unliking", function () {
    beforeEach(async function () {
      await roomMuse.connect(user1).publishRoom(
        "Architectural Loft Bedroom",
        "Exposed concrete walls paired with warm oak timber and velvet textures.",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?auto=format&fit=crop&w=1200&q=80",
        "Bedroom",
        "Master Suite"
      );
    });

    it("should allow a user to like a room and emit RoomLiked", async function () {
      const tx = await roomMuse.connect(user2).likeRoom(1);
      const receipt = await tx.wait();
      const parsedLogs = receipt.logs
        .map((log) => {
          try {
            return roomMuse.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const likedEvent = parsedLogs.find((l) => l.name === "RoomLiked");
      expect(likedEvent).to.not.be.undefined;
      expect(likedEvent.args.roomId).to.equal(1n);
      expect(likedEvent.args.user).to.equal(user2.address);
      expect(likedEvent.args.newLikeCount).to.equal(1n);

      const room = await roomMuse.getRoom(1);
      expect(room.likes).to.equal(1n);

      const user2Liked = await roomMuse.hasUserLiked(1, user2.address);
      expect(user2Liked).to.be.true;

      const [, totalLikes] = await roomMuse.getPlatformStats();
      expect(totalLikes).to.equal(1n);
    });

    it("should prevent duplicate likes from the same wallet", async function () {
      await roomMuse.connect(user2).likeRoom(1);

      let reverted = false;
      try {
        await roomMuse.connect(user2).likeRoom(1);
      } catch (err) {
        reverted = true;
        expect(err.message).to.include("RoomMuse: Already liked this room");
      }
      expect(reverted, "Duplicate like should revert").to.be.true;
    });

    it("should allow a user to unlike a room and emit RoomUnliked", async function () {
      await roomMuse.connect(user2).likeRoom(1);
      expect((await roomMuse.getRoom(1)).likes).to.equal(1n);

      const tx = await roomMuse.connect(user2).unlikeRoom(1);
      const receipt = await tx.wait();
      const parsedLogs = receipt.logs
        .map((log) => {
          try {
            return roomMuse.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const unlikedEvent = parsedLogs.find((l) => l.name === "RoomUnliked");
      expect(unlikedEvent).to.not.be.undefined;
      expect(unlikedEvent.args.roomId).to.equal(1n);
      expect(unlikedEvent.args.user).to.equal(user2.address);
      expect(unlikedEvent.args.newLikeCount).to.equal(0n);

      const room = await roomMuse.getRoom(1);
      expect(room.likes).to.equal(0n);

      const user2Liked = await roomMuse.hasUserLiked(1, user2.address);
      expect(user2Liked).to.be.false;

      const [, totalLikes] = await roomMuse.getPlatformStats();
      expect(totalLikes).to.equal(0n);
    });

    it("should revert if user tries to unlike without having liked", async function () {
      let reverted = false;
      try {
        await roomMuse.connect(user2).unlikeRoom(1);
      } catch (err) {
        reverted = true;
        expect(err.message).to.include("RoomMuse: Have not liked this room");
      }
      expect(reverted, "Unliking without prior like should revert").to.be.true;
    });
  });

  describe("Removing Room Submissions", function () {
    beforeEach(async function () {
      await roomMuse.connect(user1).publishRoom(
        "Minimalist Walnut Kitchen",
        "Seamless matte black cabinetry and natural walnut island.",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
        "Kitchen",
        "Open Kitchen"
      );
      await roomMuse.connect(user2).likeRoom(1);
    });

    it("should allow author to remove room and emit RoomRemoved", async function () {
      const tx = await roomMuse.connect(user1).removeRoom(1);
      const receipt = await tx.wait();
      const parsedLogs = receipt.logs
        .map((log) => {
          try {
            return roomMuse.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const removedEvent = parsedLogs.find((l) => l.name === "RoomRemoved");
      expect(removedEvent).to.not.be.undefined;
      expect(removedEvent.args.roomId).to.equal(1n);
      expect(removedEvent.args.author).to.equal(user1.address);

      const [activeRooms, totalLikes, totalPublished] = await roomMuse.getPlatformStats();
      expect(activeRooms).to.equal(0n);
      expect(totalLikes).to.equal(0n);
      expect(totalPublished).to.equal(1n);

      const allRooms = await roomMuse.getAllRooms();
      expect(allRooms.length).to.equal(0);

      let reverted = false;
      try {
        await roomMuse.getRoom(1);
      } catch (err) {
        reverted = true;
        expect(err.message).to.include("RoomMuse: Room does not exist or has been removed");
      }
      expect(reverted, "Getting removed room should revert").to.be.true;
    });

    it("should prevent non-author from removing a room", async function () {
      let reverted = false;
      try {
        await roomMuse.connect(user2).removeRoom(1);
      } catch (err) {
        reverted = true;
        expect(err.message).to.include("RoomMuse: Only author can remove this room");
      }
      expect(reverted, "Non-author removal should revert").to.be.true;
    });
  });

  describe("Retrieving Multiple Rooms", function () {
    it("should return all active published rooms in proper order", async function () {
      await roomMuse.connect(user1).publishRoom(
        "Room 1", "Desc 1", "https://img1.com", "Living Room", "Loft"
      );
      await roomMuse.connect(user2).publishRoom(
        "Room 2", "Desc 2", "https://img2.com", "Bedroom", "Penthouse"
      );
      await roomMuse.connect(user1).publishRoom(
        "Room 3", "Desc 3", "https://img3.com", "Workspace", "Atelier"
      );

      // Remove Room 2
      await roomMuse.connect(user2).removeRoom(2);

      const allActive = await roomMuse.getAllRooms();
      expect(allActive.length).to.equal(2);
      expect(allActive[0].id).to.equal(1n);
      expect(allActive[0].title).to.equal("Room 1");
      expect(allActive[1].id).to.equal(3n);
      expect(allActive[1].title).to.equal("Room 3");
    });
  });
});
