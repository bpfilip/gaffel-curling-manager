const { ipcMain, dialog } = require('electron');
const { getPlayers, setScore, addScore } = require("../services/players");
const { getGameData, nextPlayer, reset, setGameData } = require("../services/gameState");
const { broadcastGameData, reload } = require("./broadcast");

const { socketIO: io } = require("../server");

io.of("/gameManager").on("connection", (socket) => {
	console.log("New gameManager socket connection");

	socket.emit("gameData", getGameData());

	socket.on("setScore", ({ name, value }) => {
		setScore(name, parseInt(value));
		socket.emit("gameData", getGameData());
		broadcastGameData()
	})

	socket.on("addScore", ({ name, value }) => {
		addScore(name, parseInt(value));
		broadcastGameData()
	});

	socket.on("nextPlayer", () => {
		nextPlayer();
		broadcastGameData();
	})

	socket.on("reset", () => {
		setGameData({ currentPlayer: 0, roundNumber: 0 });
		broadcastGameData();
		reload();
	})

	socket.on("reload", () => {
		reload();
	})
});
