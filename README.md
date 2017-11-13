# rpi-wifi-config
Configure Raspberry Pi Wi-Fi over Bluetooth

## Installation
	$ npm install rpi-wifi-config --save


## Usage

	var WifiConfig = require('rpi-wifi-config');
	var wifi  = new WifiConfig();



## Methods

### constructor(iface)

Constructs a new wifi connection object.

- **iface**  - Specifies the name of the interface (default is **wlan0**)


### getNetworks()

Returns a promise containing a list of Wi-Fi networks.

````javascript

var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();

wifi.getNetworks().then((networks) => {
    console.log(networks);
});

//  [ { id: 0, ssid: 'Julia' } ]

````

### connectToNetwork(options)

Connects to the specified network.

- **options.ssid**     - Specifies the network name.
- **options.psk**      - Specifies the password.
- **options.timeout**  - Specifies the number of milliseconds to wait for connection. Default is 30000.

````javascript

var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();

wifi.connectToNetwork({ssid:'Julia', psk:'raspberry'}).then(() => {
    console.log('Connected to network.');
})
.catch((error) => {
    console.log(error);
});

````


### getNetworkStatus()

````javascript

var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();

wifi.getNetworkStatus().then((status) => {
    console.log(status);
});

// { ssid: 'Julia', ip_address: '10.0.1.189' }

````

### getNetworkStatus()

````javascript

var WifiConnection = require('./src/wifi-connection.js');
var wifi = new WifiConnection();

wifi.getConnectionState().then((connected) => {
    if (connected)        
        console.log('Connected to network.');
    else
        console.log('Not connected to network.');
});

````
