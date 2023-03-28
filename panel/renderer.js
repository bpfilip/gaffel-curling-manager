const { ipcRenderer } = require('electron');

let globalSettings = {};

navigate(localStorage.getItem("menu"));

function navigate(page) {
	localStorage.setItem("menu", page)
	let changed = false;
	const pages = document.getElementsByClassName("content");
	for (let i = 0; i < pages.length; i++) {
		if (i == page) {
			pages[i].classList.remove("hidden")
			changed = true;
		} else {
			pages[i].classList.add("hidden")
		}
	}
	if (!changed) {
		pages[0].classList.remove("hidden")
	}
}

ipcRenderer.on("addresses", (event, args) => {
	updatePanels(args);
})

function updatePanels(addresses) {
	const panels = document.getElementById("addresses-panel");
	const scoreboards = document.getElementById("addresses-scoreboard");

	const panelsFrag = document.createDocumentFragment();
	const scoreboardsFrag = document.createDocumentFragment();

	for (let i = 0; i < addresses.length; i++) {
		const panelDiv = document.createElement("a");
		const scoreboardDiv = document.createElement("a");

		panelDiv.innerText = "http://" + addresses[i] + ":" + globalSettings.port + "/panel.html";
		panelDiv.href = "http://" + addresses[i] + ":" + globalSettings.port + "/panel.html";
		panelDiv.target = "_blank";

		scoreboardDiv.innerText = "http://" + addresses[i] + ":" + globalSettings.port;
		scoreboardDiv.href = "http://" + addresses[i] + ":" + globalSettings.port;
		scoreboardDiv.target = "_blank";

		panelsFrag.appendChild(panelDiv);
		scoreboardsFrag.appendChild(scoreboardDiv);
	}

	panels.replaceChildren(panelsFrag);
	scoreboards.replaceChildren(scoreboardsFrag);
}