const os=require('os')
function getLocalIp(){
const networkInterfaces=os.networkInterfaces()
return networkInterfaces['Wi-Fi'] ? networkInterfaces['Wi-Fi'][0]['address'] :'127.0.0.1' 
}

module.exports=getLocalIp
