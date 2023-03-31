const { socketIO: io } = require("../server");
const { getGameData } = require("../services/gameState");
const { broadcastGameData, reload } = require("./broadcast");
const { Stats } = require("../db");

io.of("/statsManager").on("connection", (socket) => {
	console.log("New statsManager socket connection");

	socket.emit("gameData", getGameData());
	broadcastCurrentStats();

	socket.on("submit", (data) => {
		submitPlacement(data);
		nextPlayer();
		broadcastCurrentStats();
		broadcastGameData();
	})

	socket.on("reload", () => {
		reload();
	})

	socket.on("reset", () => {
		reset();
		broadcastCurrentStats();
		broadcastGameData();
	})

	socket.on("updateCurrentStats", () => {
		broadcastCurrentStats();
	})
});

function broadcastCurrentStats() {
	const currentStats = getCurrentStats();
	console.log(JSON.stringify(currentStats))
	io.of("/stats").emit("currentStats", currentStats);
	io.of("/statsManager").emit("currentStats", currentStats);
}

function getCurrentPlayers() {
	const currentPlayer = Stats.getData("/currentPlayer");
	const nextPlayer = Stats.getData("/nextPlayer");
	const roundNumber = Stats.getData("/roundNumber");

	return { currentPlayer, nextPlayer, roundNumber };
}

function nextPlayer() {
	const players = getCurrentPlayers();
	const gameData = getGameData();

	players.currentPlayer = (players.currentPlayer + 1) % gameData.players.length;

	if (players.currentPlayer === (players.roundNumber % gameData.players.length)) { // New round
		players.roundNumber++;
		players.currentPlayer = (players.currentPlayer + 1) % gameData.players.length;
	}

	players.nextPlayer = (players.currentPlayer + 1) % gameData.players.length;

	if (players.nextPlayer === (players.roundNumber % gameData.players.length)) { // New round
		players.nextPlayer = (players.nextPlayer + 1) % gameData.players.length;
	}

	Stats.push("/currentPlayer", players.currentPlayer);
	Stats.push("/nextPlayer", players.nextPlayer);
	Stats.push("/roundNumber", players.roundNumber);
}

function reset() {
	Stats.push("/currentPlayer", 0);
	Stats.push("/nextPlayer", 1);
	Stats.push("/roundNumber", 0);
	Stats.push("/players", {});
}

function getCurrentStats() {
	const players = Stats.getData("/players");

	const stats = {
		...getCurrentPlayers()
	};

	// Loop players
	for (let playerKeyIndex = 0; playerKeyIndex < Object.keys(players).length; playerKeyIndex++) {
		const playerId = Object.keys(players)[playerKeyIndex];
		stats[playerId] = { locations: {}, types: {} };

		// Starts by summing up all the locations and types
		// Then it divides it by the roundCount to get the percentage

		// Loop rounds
		for (let round = 0; round < players[playerId].rounds.length; round++) {
			// Loop types
			for (let j = 0; j < players[playerId].rounds[round].types.length; j++) {
				if (stats[playerId].types[players[playerId].rounds[round].types[j]] === undefined) {
					stats[playerId].types[players[playerId].rounds[round].types[j]] = 1;
				}
				else {
					stats[playerId].types[players[playerId].rounds[round].types[j]] += 1;
				}
			}
			// Location
			if (stats[playerId].locations[players[playerId].rounds[round].location] === undefined) {
				stats[playerId].locations[players[playerId].rounds[round].location] = 1;
			}
			else {
				stats[playerId].locations[players[playerId].rounds[round].location] += 1;
			}
		}

		const roundCount = players[playerId].rounds.length;
		// Divide all types with roundCount to get percentage of all rounds
		for (let i = 0; i < Object.keys(stats[playerId].types).length; i++) {
			const type = Object.keys(stats[playerId].types)[i];

			stats[playerId].types[type] /= roundCount;
		}
		// Divide all locations with roundCount to get percentage of all rounds
		for (let i = 0; i < Object.keys(stats[playerId].locations).length; i++) {
			const location = Object.keys(stats[playerId].locations)[i];

			stats[playerId].locations[location] /= roundCount;
		}
	}

	return stats;
}

function submitPlacement({ location, types }) {
	const player = Stats.getData("/currentPlayer");
	Stats.push(`/players/${player}/rounds[]`, { location, types });
}

