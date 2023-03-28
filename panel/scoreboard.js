const { ipcRenderer } = require('electron');

async function updateStyles() {
	const settings = await ipcRenderer.invoke("getSettings");

	console.log(settings);

	displayStyles(settings.scoreboardStyles)
}

updateStyles();

function displayStyles(styles) {
	// for (const [style, value] of Object.entries(styles)) {
	// 	if (style.endsWith("-size"))
	// 		document.documentElement.style.setProperty('--' + style, value + "px");
	// 	else if (style === "layout-style")
	// 		document.getElementById("scoreboard").className = value;
	// 	else
	// 		document.documentElement.style.setProperty('--' + style, value);
	// }

	for (const [style, value] of Object.entries(styles)) {
		const node = document.querySelector(`#styles > .style > .input[name="${style}"]`)
		if (style.endsWith("-size") || style === "layout-style" || style == "font") {
			node.value = value;
		} else if (style === "animate") {
			if (value)
				document.getElementById("animateCheckbox").setAttribute("checked", true);
			else
				document.getElementById("animateCheckbox").removeAttribute("checked");
		}
		else {
			node.jscolor.fromString(value)
		}
	}
}

async function sendStyles() {
	const styles = {};
	const nodes = document.querySelectorAll("#styles > .style > .input");
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].type === "checkbox") {
			styles[nodes[i].name] = nodes[i].checked;
		} else
			styles[nodes[i].name] = nodes[i].value;
	}

	await ipcRenderer.invoke('updateScoreboardStyles', styles);
	await updateStyles();
}