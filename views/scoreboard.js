const { getGameData } = require("../services/gameState");
const { getSettings } = require("../services/settings");

const { socketIO: io } = require("../server");

io.of("/scoreboard").on("connection", (socket) => {
	console.log("New scoreboard socket connection");

	socket.emit("gameData", getGameData());
	socket.emit("stylesChanged", getSettings().scoreboardStyles)
});
