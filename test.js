var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();

wifi.connectToNetwork({ssid:'JuliXa', psk:'potatismos'}).then(() => {
    console.log('Connected to network.');
});
