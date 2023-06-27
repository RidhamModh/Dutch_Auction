require("@nomicfoundation/hardhat-toolbox");
require('solidity-coverage');

const ALCHEMY_API_KEY = "YNYEFru-zLlJ_tEoIjwtYenvyi0zu_0J";
const SEPOLIA_PRIVATE_KEY = "004d40b6371341af60cd448971a939db76e218e9fcddd08ddfa2f6cbf7f924de";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  coverage: {
    enabled: true,
    reporter: ["html", "lcov"],
    outputDir: "./coverage",
  },
  networks: {
    hardhat: {
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
  paths: {
    artifacts: '../frontend/src/artifacts',
  }

  // Replace this private key with your Sepolia account private key
  // To export your private key from Metamask, open Metamask and
  // go to Account Details > Export Private Key
  // Beware: NEVER put real Ether into testing accounts

};