const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = "taxi favorite pulp scrap intact country artwork track tumble badge where diamond";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "0.5.3",
    },
  },
  networks: {
    production: {
      host: "167.179.75.85",
      port: 8545,
      network_id: 2020,
      from: "0x007ccffb7916f37f7aeef05e8096ecfbe55afc2f",
      gasPrice: 0,
      gas: 6721975,
    },
    // ganache: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "5777",
    // },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gasPrice: 0,
    },
    goerli: {
       provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/8dcc3baf72ae4061ac53e9f70deeaa4e`),
       network_id: 5,       // Goerli's id
       confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
      },
  },
};