const ngrok=require('@ngrok/ngrok')
require('dotenv').config()

function startTunnel(){
  const {NGROK_USER,NGROK_PASS,NGROK_AUTHTOKEN}=process.env
  return new Promise(async (resolve,reject)=>{
    if(!NGROK_AUTHTOKEN) reject('devi autenticarti con il token')
    if(!NGROK_USER || !NGROK_PASS) reject('CREDENZIALI SCORRETTE')
      
    ngrok.forward({addr:8080,proto:'http',authtoken:NGROK_AUTHTOKEN,basic_auth:[`${NGROK_USER}:${NGROK_PASS}`]}) 
    .then(forwarder=>resolve(forwarder.url()))
    .catch(err=>reject(err))
    
   
  }
  )
}
module.exports=startTunnel


module.exports = startTunnel;

