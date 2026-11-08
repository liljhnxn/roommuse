// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RoomMuse
 * @dev "Spaces Worth Inspiring."
 * A decentralized interior-design inspiration platform where users share beautiful
 * room designs, discover decoration ideas, and explore creative spaces.
 */
contract RoomMuse {
    struct Room {
        uint256 id;
        address author;
        string title;
        string description;
        string imageUrl;
        string category;
        string roomType;
        uint256 likes;
        uint256 timestamp;
        bool exists;
    }

    uint256 private _roomIds;
    uint256 public totalActiveRooms;
    uint256 public totalLikesCount;

    // Mapping from room ID to Room
    mapping(uint256 => Room) private rooms;

    // Array of all room IDs created (to allow fetching all active rooms)
    uint256[] private allRoomIds;

    // Mapping from room ID => user address => bool (has liked)
    mapping(uint256 => mapping(address => bool)) private hasLikedRoom;

    // Events
    event RoomPublished(
        uint256 indexed roomId,
        address indexed author,
        string title,
        string category,
        string roomType,
        uint256 timestamp
    );

    event RoomLiked(
        uint256 indexed roomId,
        address indexed user,
        uint256 newLikeCount,
        uint256 timestamp
    );

    event RoomUnliked(
        uint256 indexed roomId,
        address indexed user,
        uint256 newLikeCount,
        uint256 timestamp
    );

    event RoomRemoved(
        uint256 indexed roomId,
        address indexed author,
        uint256 timestamp
    );

    // Modifiers
    modifier roomExists(uint256 _roomId) {
        require(rooms[_roomId].exists, "RoomMuse: Room does not exist or has been removed");
        _;
    }

    /**
     * @notice Publish a new room design.
     * @param _title Title of the room design
     * @param _description Editorial description of the space and styling notes
     * @param _imageUrl High quality image URL of the room
     * @param _category Category (e.g., Bedroom, Living Room, Kitchen, Workspace, Minimalist)
     * @param _roomType Specific room type or style (e.g. Master Suite, Penthouse Salon, Studio)
     */
    function publishRoom(
        string calldata _title,
        string calldata _description,
        string calldata _imageUrl,
        string calldata _category,
        string calldata _roomType
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "RoomMuse: Title cannot be empty");
        require(bytes(_imageUrl).length > 0, "RoomMuse: Image URL cannot be empty");
        require(bytes(_category).length > 0, "RoomMuse: Category cannot be empty");
        require(bytes(_roomType).length > 0, "RoomMuse: Room type cannot be empty");

        _roomIds++;
        uint256 newRoomId = _roomIds;

        Room storage r = rooms[newRoomId];
        r.id = newRoomId;
        r.author = msg.sender;
        r.title = _title;
        r.description = _description;
        r.imageUrl = _imageUrl;
        r.category = _category;
        r.roomType = _roomType;
        r.likes = 0;
        r.timestamp = block.timestamp;
        r.exists = true;

        allRoomIds.push(newRoomId);
        totalActiveRooms++;

        emit RoomPublished(
            newRoomId,
            msg.sender,
            _title,
            _category,
            _roomType,
            block.timestamp
        );

        return newRoomId;
    }

    /**
     * @notice Like a room design. Prevents duplicate likes from the same wallet.
     * @param _roomId The ID of the room
     */
    function likeRoom(uint256 _roomId) external roomExists(_roomId) {
        require(!hasLikedRoom[_roomId][msg.sender], "RoomMuse: Already liked this room");

        hasLikedRoom[_roomId][msg.sender] = true;
        rooms[_roomId].likes++;
        totalLikesCount++;

        emit RoomLiked(_roomId, msg.sender, rooms[_roomId].likes, block.timestamp);
    }

    /**
     * @notice Unlike a room design if previously liked.
     * @param _roomId The ID of the room
     */
    function unlikeRoom(uint256 _roomId) external roomExists(_roomId) {
        require(hasLikedRoom[_roomId][msg.sender], "RoomMuse: Have not liked this room");

        hasLikedRoom[_roomId][msg.sender] = false;
        rooms[_roomId].likes--;
        if (totalLikesCount > 0) {
            totalLikesCount--;
        }

        emit RoomUnliked(_roomId, msg.sender, rooms[_roomId].likes, block.timestamp);
    }

    /**
     * @notice Check if a specific address has liked a room design.
     * @param _roomId ID of the room
     * @param _user Address to check
     */
    function hasUserLiked(uint256 _roomId, address _user) external view returns (bool) {
        return hasLikedRoom[_roomId][_user];
    }

    /**
     * @notice Remove a room submission (only the original author can remove).
     * @param _roomId ID of the room to remove
     */
    function removeRoom(uint256 _roomId) external roomExists(_roomId) {
        require(rooms[_roomId].author == msg.sender, "RoomMuse: Only author can remove this room");

        rooms[_roomId].exists = false;
        totalActiveRooms--;
        if (totalLikesCount >= rooms[_roomId].likes) {
            totalLikesCount -= rooms[_roomId].likes;
        } else {
            totalLikesCount = 0;
        }

        emit RoomRemoved(_roomId, msg.sender, block.timestamp);
    }

    /**
     * @notice Get a single room by ID.
     * @param _roomId ID of the room
     */
    function getRoom(uint256 _roomId) external view roomExists(_roomId) returns (Room memory) {
        return rooms[_roomId];
    }

    /**
     * @notice Retrieve all published and active room designs.
     */
    function getAllRooms() external view returns (Room[] memory) {
        uint256 activeCount = totalActiveRooms;
        Room[] memory activeRooms = new Room[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < allRoomIds.length; i++) {
            uint256 rId = allRoomIds[i];
            if (rooms[rId].exists) {
                activeRooms[currentIndex] = rooms[rId];
                currentIndex++;
                if (currentIndex == activeCount) {
                    break;
                }
            }
        }

        return activeRooms;
    }

    /**
     * @notice Get total stats (total active rooms, total likes and lifetime published).
     */
    function getPlatformStats() external view returns (
        uint256 activeRooms,
        uint256 totalLikes,
        uint256 totalPublishedEver
    ) {
        return (totalActiveRooms, totalLikesCount, _roomIds);
    }
}
