
var WifiConnection = require('./src/wifi-connection.js');


var wifi = new WifiConnection();

wifi.getNetworks().then((networks) => {
    console.log(networks);
});
