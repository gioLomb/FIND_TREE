const os = require('os');

// Restituisce il primo indirizzo IPv4 locale non interno (es. Wi-Fi)
// Fallback a 127.0.0.1 se non trovato
function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  for (const iface of Object.values(networkInterfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return '127.0.0.1';
}

module.exports = getLocalIp;