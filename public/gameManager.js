const socket = io("/gameManager");

function nextPlayer() {
	socket.emit("nextPlayer");
}

function reset() {
	socket.emit("reset");
}

function reload() {
	socket.emit("reload");
}

socket.on("reload", ()=>{
	location.reload()
})

socket.on("gameData", (gameData) => {
	console.log(gameData);
	document.getElementById("currentPlayer").innerText = `${gameData.players[gameData.currentPlayer].number} - ${gameData.players[gameData.currentPlayer].name}`;
	document.getElementById("nextPlayer").innerText = `${gameData.players[gameData.nextPlayer].number} - ${gameData.players[gameData.nextPlayer].name}`;

	document.getElementById("round").innerText = gameData.roundNumber + 1;

	updateScoreEdit(gameData.players)

	const scoreboard = gameData.players;
	scoreboard.sort((a, b) => b.score - a.score);

	const elements = document.createDocumentFragment();
	for (let i = 0; i < scoreboard.length; i++) {
		const div = document.createElement("div");
		const name = document.createElement("span");
		const score = document.createElement("span");

		div.className = "scoreItem";
		name.className = "name";
		score.className = "score";

		name.innerText = `${scoreboard[i].number} - ${scoreboard[i].name}`;
		score.innerText = scoreboard[i].score;

		div.appendChild(name);
		div.appendChild(score);

		elements.appendChild(div);
	}

	document.getElementById("scoreboard").replaceChildren(elements)
})

function updateScoreEdit(scores) {
	const elements = document.createDocumentFragment();
	for (let i = 0; i < scores.length; i++) {
		const score = scores[i]
		const div = document.createElement("div");
		const name = document.createElement("div");
		const editScore = document.createElement("div");

		div.className = "score";
		name.className = "name";
		editScore.className = "editScore";

		name.innerText = `${score.number} - ${score.name}`;

		for (let i = -3; i <= 3; i++) {
			if (i !== 0) {
				const button = document.createElement("button");
				button.innerText = i > 0 ? "+" + i : i;
				const value = i;
				button.addEventListener("click", event => {
					socket.emit('addScore', { name: score.name, value });
				})
				editScore.appendChild(button);
			}
			else {
				const scoreInput = document.createElement("input");
				scoreInput.value = score.score;
				scoreInput.type = "number";
				scoreInput.addEventListener("change", event => {
					socket.emit('setScore', { name: score.name, value: event.target.value });
				})
				editScore.appendChild(scoreInput);
			}
		}

		div.appendChild(name);
		div.appendChild(editScore);
		elements.appendChild(div);
	}

	document.getElementById("scoreInput").replaceChildren(elements)
}