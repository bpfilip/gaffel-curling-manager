const { ipcMain } = require('electron');
const { networkInterfaces } = require('os');

function getAddresses() {
	const nets = networkInterfaces();
	const addresses = [];

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === 'IPv4' && !net.internal) {
				addresses.push(net.address);
			}
		}
	}
	return addresses;
}

ipcMain.handle('getAddresses', (event, ...args) => {
	return getAddresses();
})