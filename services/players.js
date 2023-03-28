const { Players } = require("../db");

function getPlayers() {
	return Players.getData("/players");
}

function setPlayers(players) {
	Players.push("/players", players);
}

function addPlayer(name) {
	const players = getPlayers();
	players.push({ name, score: 0 });
	setPlayers(players);
}

function renamePlayer(number, newName) {
	const players = getPlayers();
	const i = players.findIndex(player => player.number === number);
	if (i > -1) {
		players[i].name = newName;
	}
	setPlayers(players);
}

function changeTeamPlayer(number, newTeam) {
	const players = getPlayers();
	const i = players.findIndex(player => player.number === number);
	if (i > -1) {
		players[i].team = newTeam;
	}
	console.log(number, newTeam, players);
	setPlayers(players);
}

function changeNumberPlayer(name, newNumber) {
	const players = getPlayers();
	const i = players.findIndex(player => player.name === name);
	if (i > -1) {
		players[i].number = newNumber;
	}
	setPlayers(players);
}

function removePlayer(name) {
	const players = getPlayers();
	const i = players.findIndex(player => player.name === name);
	if (i > -1) {
		players.splice(i, 1);
	}
	setPlayers(players);
}

function setPlayerIndex(name, index) {
	const players = getPlayers();
	const i = players.findIndex(player => player.name === name);
	if (i > -1) {
		const player = players[i];
		players.splice(i, 1);
		players.splice(index, 0, player);
		setPlayers(players);
	}
}

function movePlayer(name, offset) {
	const players = getPlayers();
	const i = players.findIndex(player => player.name === name);
	if (i > -1) {
		const player = players[i];
		players.splice(i, 1);
		players.splice(i + offset, 0, player);
		setPlayers(players);
	}
}

function setScore(name, value) {
	const players = getPlayers();
	const i = players.findIndex(player => player.name === name);
	if (i > -1) {
		players[i].score = value;
		setPlayers(players);
	}
}

function addScore(name, value) {
	const players = getPlayers();
	const i = players.findIndex(player => player.name === name);
	if (i > -1) {
		players[i].score += value;
		setPlayers(players);
	}
}

module.exports = { getPlayers, setPlayers, addPlayer, renamePlayer, removePlayer, setPlayerIndex, movePlayer, setScore, addScore, changeTeamPlayer, changeNumberPlayer }