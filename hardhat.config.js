require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY
  ? (process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY : "0x" + process.env.PRIVATE_KEY)
  : undefined;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    botchain: {
      url: process.env.BOTCHAIN_RPC_URL || "https://rpc.bohr.life",
      chainId: 968,
      accounts: privateKey ? [privateKey] : [],
    },
  },
};
