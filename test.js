
var WifiConnection = require('./src/wifi-connection.js');


var wifi = new WiFiConnection();

wifi.getNetworks().then((networks) => {
    console.log(networks);
});
