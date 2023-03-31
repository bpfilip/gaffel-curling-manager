const { socketIO: io } = require("../server");
const { getGameData } = require("../services/gameState");

function broadcastGameData() {
	const gameData = getGameData()
	io.of("/gameManager").emit("gameData", gameData)
	io.of("/playerView").emit("gameData", gameData)
	io.of("/scoreboard").emit("gameData", gameData)
	io.of("/lowerThird").emit("gameData", gameData)
	io.of("/statsManager").emit("gameData", gameData)
}

function reload() {
	io.of("/gameManager").emit("reload")
	io.of("/playerView").emit("reload")
	io.of("/scoreboard").emit("reload")
	io.of("/lowerThird").emit("reload")
	io.of("/statsManager").emit("reload")
}

module.exports = { broadcastGameData, reload }