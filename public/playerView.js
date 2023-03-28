const socket = io("/playerView");


socket.on("reload", ()=>{
	location.reload()
})

socket.on("gameData", (gameData) => {
	document.getElementById("currentPlayer").innerText = `${gameData.players[gameData.currentPlayer].number} - ${gameData.players[gameData.currentPlayer].name}`;
	document.getElementById("nextPlayer").innerText = `${gameData.players[gameData.nextPlayer].number} - ${gameData.players[gameData.nextPlayer].name}`;

	document.getElementById("round").innerText = gameData.roundNumber + 1;

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

		// if (pictureMode) {
		// 	const img = document.createElement("img");
		// 	img.src = `profiles/${scoreboard[i].name}.png`;
		// 	div.appendChild(img);
		// }

		div.appendChild(name);
		div.appendChild(score);
		elements.appendChild(div);
	}
	document.getElementById("scoreboard").replaceChildren(elements)
})