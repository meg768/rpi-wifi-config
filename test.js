
var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();


wifi.getNetworkStatus().then((status) => {
    console.log(status);
});
/*
wifi.getNetworks().then((networks) => {
    console.log(networks);
});

wifi.getNetworkStatus().then((status) => {
    console.log('Status', status);
});

*/
