var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();

wifi.connectToNetwork({ssid:'Julia', psk:'potatismos'}).then(() => {
    console.log('Connected to network.');
})
.catch((error) => {
    console.log(error);
});
