require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  networks: {

    hardhat: {
      forking: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/U7-rQDtPo9P6mDi_gNjQW761_j_nfk8P"
      },
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/b_hn2oETygzJLSLi4Bt69dDZVzPz5P-l" || "",
      accounts:
        ["0x4967d9360f24a79a6b0e7eae94c9460ef00039a7d04f89defcb07ef7f4ec80ad"],
      allowUnlimitedContractSize: true,
    },
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS,
    currency: "USD",
    token: "MATIC",
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice"
  },
};
