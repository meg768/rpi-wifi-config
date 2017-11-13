var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();

wifi.getConnectionState().then((connected) => {
    if (connected)
        console.log('Connected to network.');
    else
        console.log('Not connected to network.');
});
