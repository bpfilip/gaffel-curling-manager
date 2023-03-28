const { Game } = require("../db");
const { getPlayers } = require("../services/players");
const { socketIO: io } = require("../server");

function getGameData() {
	const gameData = Game.getData("/");
	const players = getPlayers();

	gameData.nextPlayer = (gameData.currentPlayer + 1) % players.length;

	if (gameData.nextPlayer === (gameData.roundNumber % players.length)) { // New round
		gameData.nextPlayer = (gameData.nextPlayer + 1) % players.length;
	}

	return {
		players,
		...gameData,
	}
}

function setGameData(gameData) {
	Game.push("/", gameData);
}

function nextPlayer() {
	const gameData = getGameData();
	const players = getPlayers();

	gameData.currentPlayer = (gameData.currentPlayer + 1) % players.length;

	if (gameData.currentPlayer === (gameData.roundNumber % players.length)) { // New round
		gameData.roundNumber++;
		gameData.currentPlayer = (gameData.currentPlayer + 1) % players.length;
	}

	setGameData({ currentPlayer: gameData.currentPlayer, roundNumber: gameData.roundNumber });
}

function reset() {
	setGameData({ currentPlayer: 0, roundNumber: 0 });
	reload()
}

module.exports = { getGameData, nextPlayer, reset, setGameData };