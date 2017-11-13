
var fs            = require('fs');
var sprintf       = require('yow/sprintf');
var isString      = require('yow/is').isString;
var Events        = require('events');
var ChildProcess  = require('child_process');
var Watch         = require('watch');
var Path          = require('path');

function debug() {
    console.log.apply(this, arguments);
}



module.exports = class WiFiConnection {

    constructor(iface = 'wlan0') {
        this.iface = iface;
    }

    wpa_cli(command, pattern) {

        return new Promise((resolve, reject) => {

            ChildProcess.exec(sprintf('wpa_cli -i %s %s', this.iface, command), (error, stdout, stderr) => {
                if (error)
                    reject(error);
                else {
                    var output = stdout.trim();

                    if (pattern) {
                        var match = output.match(pattern);

                        if (match) {
                            if (match[1])
                                resolve(match[1]);
                            else
                                resolve();
                        }
                        else
                            reject(new Error(sprintf('Could not parse reply from wpa_cli: "%s"', output)));

                    }
                    else {
                        resolve(output);
                    }
                }
            });
        });
    }

    getConnectionState() {
        return new Promise((resolve, reject) => {

            this.getNetworkStatus().then((status) => {
                resolve(isString(status.ip_address));
            })

            .catch((error) => {
                reject(error);
            })
        });

    }

    getNetworkStatus() {
        return new Promise((resolve, reject) => {

            this.wpa_cli('status').then((output) => {

                var match;
                var status = {};

                if ((match = output.match(/[^b]ssid=([^\n]+)/))) {
                    status.ssid = match[1];
                }

                if ((match = output.match(/ip_address=([^\n]+)/))) {
                    status.ip_address = match[1];
                }

                resolve(status);
            })
            .catch((error) => {
                reject(error);
            })
        });

    }

    getNetworks() {
        return new Promise((resolve, reject) => {

            this.wpa_cli('list_networks').then((output) => {

                output = output.split('\n');

                // Remove header
                output.splice(0, 1);

                var networks = [];

                output.forEach((line) => {
                    var params = line.split('\t');
                    networks.push({
                        id   : parseInt(params[0]),
                        ssid : params[1]
                    });

                });

                resolve(networks);
            })
            .catch((error) => {
                reject(error);
            })
        });

    }


    connectToNetwork(ssid, password, timeout = 20000) {

        var self = this;


        function delay(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms);
            });
        }

        function addNetwork() {
            debug('Adding network...');
            return self.wpa_cli('add_network', '^([0-9]+)');
        }


        function setNetworkVariable(id, name, value) {
            debug(sprintf('Setting variable %s=%s for network %d.', name, value, id));
            return self.wpa_cli(sprintf('set_network %d %s \'"%s"\'', id, name, value), '^OK');
        }


        function selectNetwork(id) {
            debug(sprintf('Selecting network %d...', id));
            return self.wpa_cli(sprintf('select_network %s', id), '^OK');
        }

        function saveConfiguration() {
            debug(sprintf('Saving configuration...'));
            return self.wpa_cli(sprintf('save_config'), '^OK');
        }

        function removeNetwork(id) {
            debug(sprintf('Removing network #%d...', id));
            this.wpa_cli(sprintf('remove_network %d', id), '^OK');
        }

        function waitForNetworkConnection(timeout, timestamp) {

            if (timestamp == undefined)
                timestamp = new Date();

            return new Promise((resolve, reject) => {

                self.getConnectionState().then((connected) => {

                    if (connected) {
                        return Promise.resolve();
                    }
                    else {
                        var now = new Date();

                        if (now.getTime() - timestamp.getTime() < timeout) {
                            return delay(1000).then(() => {
                                return waitForNetworkConnection(timeout, timestamp);
                            })
                        }
                        else
                            throw new Error('Unable to connect to network.');
                    }
                })

                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

            });

        }

        function removeAllNetworks() {
            debug('Removing all networks...');

            return new Promise((resolve, reject) => {
                self.getNetworks().then((networks) => {
                    var promise = Promise.resolve();

                    networks.forEach((network) => {
                        promise = promise.then(() => {
                            return removeNetwork(network.id);
                        });
                    });

                    promise.then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    })
                });
            });

        }

        return new Promise((resolve, reject) => {

            var networkID = undefined;

            removeAllNetworks().then(() => {
                return addNetwork();
            })
            .then((id) => {
                debug('Network created:', id);
                networkID = parseInt(id);
                return Promise.resolve();
            })
            .then(() => {
                return setNetworkVariable(networkID, 'ssid', ssid);
            })
            .then(() => {
                return (isString(password) ? setNetworkVariable(networkID, 'psk', password) : Promise.resolve());
            })
            .then(() => {
                return selectNetwork(networkID);
            })

            .then(() => {
                return waitForNetworkConnection(timeout);
            })

            .then(() => {
                return saveConfiguration();
            })

            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            })
        });

    }
}
