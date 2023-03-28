const { ipcRenderer } = require('electron');

async function main() {
	const settings = await ipcRenderer.invoke("getSettings");

	document.getElementById("port").value = settings.port;
	document.getElementById("obsPort").value = settings.obsPort;
	document.getElementById("companionPort").value = settings.companionPort;
}

main()

function updatePort(ev) {
	const port = parseInt(ev.target.value);
	ipcRenderer.invoke("updateSettings", { port });
}

function updateOBSPort(ev) {
	const obsPort = parseInt(ev.target.value);
	ipcRenderer.invoke("updateSettings", { obsPort });
}

function companionPort(ev) {
	const companionPort = parseInt(ev.target.value);
	ipcRenderer.invoke("updateSettings", { companionPort });
}