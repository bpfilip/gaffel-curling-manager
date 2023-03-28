const { ipcMain, dialog } = require('electron');
const { getGameData } = require("../services/gameState");

const { socketIO: io } = require("../server");

io.of("/playerView").on("connection", (socket) => {
	console.log("New playerView socket connection");

	socket.emit("gameData", getGameData());
});
