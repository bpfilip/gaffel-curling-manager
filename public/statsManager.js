const socket = io("/statsManager");

socket.on("reload", () => {
	Selected = undefined;
	document.getElementById("submitButton").disabled = true;
	location.reload();
})

socket.on("currentStats", (data) => {
	console.log(data)
	if (Selected === undefined)
		document.getElementById("submitButton").disabled = true;
})

function reload() {
	socket.emit("reload");
}

function reset() {
	socket.emit("reset");
}

let GameData = {};
let Stats = {};

let Selected;
let types = [];

socket.on("gameData", (gameData) => {
	console.log(gameData);
	GameData = gameData;
})

socket.on("currentStats", (stats) => {
	console.log(stats);
	document.getElementById("currentPlayer").innerText = `${GameData.players[stats.currentPlayer].number} - ${GameData.players[stats.currentPlayer].name}`;
	document.getElementById("nextPlayer").innerText = `${GameData.players[stats.nextPlayer].number} - ${GameData.players[stats.nextPlayer].name}`;

	document.getElementById("round").innerText = stats.roundNumber + 1;
	Stats = stats;
})

function clearSelection(place) {
	document.getElementById("submitButton").disabled = true;
	if (place === undefined) return;
	document.getElementById(place).classList.remove("selected");
	place = undefined;
}

function select(event) {
	const place = event.target.id;

	if (Selected)
		clearSelection(Selected);

	Selected = place;

	event.target.classList.add("selected");

	document.getElementById("submitButton").disabled = false;
}

function clearTypes() {
	types.forEach(type => {
		document.getElementById(type).classList.remove("selected");
	})
	types = [];
}

function setType(event) {
	const type = event.target.id;

	if (types.includes(type)) {
		types = types.filter((item) => item !== type);
		event.target.classList.remove("selected");
	} else {
		types.push(type);
		event.target.classList.add("selected");
	}
}

function submit() {
	socket.emit("submit", { location: Selected, types });

	clearTypes();
	clearSelection(Selected);
}