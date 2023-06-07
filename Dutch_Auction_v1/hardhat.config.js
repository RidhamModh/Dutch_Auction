require("@nomicfoundation/hardhat-toolbox");
require('solidity-coverage');

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
    }
  }
};