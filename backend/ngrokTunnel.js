const ngrok = require('@ngrok/ngrok');
require('dotenv').config();

// Apre un tunnel ngrok sulla porta 8080 con Basic Auth
function startTunnel() {
  const { NGROK_USER, NGROK_PASS, NGROK_AUTHTOKEN } = process.env;

  return new Promise(async (resolve, reject) => {
    if (!NGROK_AUTHTOKEN) reject('devi autenticarti con il token');
    if (!NGROK_USER || !NGROK_PASS) reject('CREDENZIALI SCORRETTE');

    ngrok.forward({
      addr: 8080,
      proto: 'http',
      authtoken: NGROK_AUTHTOKEN,
      basic_auth: [`${NGROK_USER}:${NGROK_PASS}`]  // protezione con HTTP Basic Auth
    })
      .then(forwarder => resolve(forwarder.url()))
      .catch(err => reject(err));
  });
}

module.exports = startTunnel;