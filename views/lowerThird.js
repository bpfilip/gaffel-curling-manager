const { getSettings } = require("../services/settings");
const { getGameData } = require("../services/gameState");

const { socketIO: io } = require("../server");

io.of("/lowerThird").on("connection", (socket) => {
	console.log("New lower third socket connection");

	socket.emit("stylesChanged", getSettings().lowerThirdStyles);
	socket.emit("gameData", getGameData());
});
