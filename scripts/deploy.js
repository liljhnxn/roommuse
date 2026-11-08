const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("-----------------------------------------");
  console.log("RoomMuse Deployment Script");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId || (await hre.ethers.provider.getNetwork()).chainId);
  console.log("-----------------------------------------");

  const [deployer] = await hre.ethers.getSigners();
  if (deployer) {
    console.log("Deploying contract with account:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  } else {
    console.log("No signer available. Ensure PRIVATE_KEY is configured in .env for live networks.");
  }

  const RoomMuse = await hre.ethers.getContractFactory("RoomMuse");
  console.log("Deploying RoomMuse contract...");
  const roomMuse = await RoomMuse.deploy();
  await roomMuse.waitForDeployment();

  const contractAddress = await roomMuse.getAddress();
  console.log("SUCCESS: RoomMuse deployed to:", contractAddress);

  // Export contract deployment info and ABI to frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/RoomMuse.sol/RoomMuse.json");
  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  const deploymentData = {
    address: contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 968,
    deployedAt: new Date().toISOString(),
    abi: abi,
  };

  const outputDir = path.join(__dirname, "../contracts/data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "deployed-contract.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("Contract data saved to contracts/data/deployed-contract.json");
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

