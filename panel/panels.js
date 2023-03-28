const { ipcRenderer } = require('electron');

function updatePanels(addresses, settings) {
	const panels = document.getElementById("addresses-panel");
	const scoreboards = document.getElementById("addresses-scoreboard");

	const panelsFrag = document.createDocumentFragment();
	const scoreboardsFrag = document.createDocumentFragment();

	for (let i = 0; i < addresses.length; i++) {
		const panelDiv = document.createElement("a");
		const scoreboardDiv = document.createElement("a");

		panelDiv.innerText = "http://" + addresses[i] + ":" + settings.port + "/panel.html";
		panelDiv.href = "http://" + addresses[i] + ":" + settings.port + "/panel.html";
		panelDiv.target = "_blank";

		scoreboardDiv.innerText = "http://" + addresses[i] + ":" + settings.port;
		scoreboardDiv.href = "http://" + addresses[i] + ":" + settings.port;
		scoreboardDiv.target = "_blank";

		panelsFrag.appendChild(panelDiv);
		scoreboardsFrag.appendChild(scoreboardDiv);
	}

	panels.replaceChildren(panelsFrag);
	scoreboards.replaceChildren(scoreboardsFrag);
}

async function main() {
	const addresses = await ipcRenderer.invoke("getAddresses");
	const settings = await ipcRenderer.invoke("getSettings");
	updatePanels(addresses, settings);
}

main();