module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",      // Localhost
      port: 7545,             // Ganache default port
      network_id: "*",     // Must match Ganache's network ID (from your screenshot)
    }
  },
  compilers: {
    solc: {
      version: "0.8.10",      // Match your pragma statement
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    }
  },
  develop: {
    port: 8545
  }
};