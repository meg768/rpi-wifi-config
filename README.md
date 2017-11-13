# rpi-wifi-config
Configure Raspberry Pi Wi-Fi over Bluetooth

## Installation
	$ npm install rpi-wifi-config --save


## Usage

	var WifiConfig = require('rpi-wifi-config');
	var var wifiConfig  = new WifiConfig();

	matrix.runText('Hello World');



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

````
