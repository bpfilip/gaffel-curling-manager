const socket = io("/stats");

socket.on("reload", ()=>{
	location.reload()
})

let GameData;

socket.on("gameData", (gameData) => {
	console.log(gameData);
	const player = gameData.players[gameData.currentPlayer]
	document.getElementById("currentPlayer").innerText = player.name;
	document.getElementById("team").innerText = `${player.team}`;
	document.getElementById("picture").src = `profiles/${player.number}.png`;
	GameData = gameData;
})

function updateStyle(styles) {
	for (const [style, value] of Object.entries(styles)) {
		if (style.endsWith("-size"))
			document.documentElement.style.setProperty('--' + style, value + "px");
		else if (style === "layout-style") {

		}
		else
			document.documentElement.style.setProperty('--' + style, value);
	}
}