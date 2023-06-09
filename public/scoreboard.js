const socket = io("/scoreboard");

let globalScoreboard = [];
let globalStyles = {};

socket.on("gameData", gameData => {
	updateScoreboard(gameData.players)
});


socket.on("reload", ()=>{
	location.reload()
})

socket.on("stylesChanged", styles => {
	globalStyles = styles;
	updateStyle(styles);
});

let pictureMode = false;
let oldScoreboard = [];

function updateScoreboard(scoreboard) {
	scoreboard = sortScoreboard(scoreboard)
	globalScoreboard = scoreboard;

	const distances = scoreboard.map((score, i) => {
		const oldScoreIndex = oldScoreboard.findIndex(s => s.name === score.name);
		const movePlaces = i - oldScoreIndex;
		if (oldScoreIndex < 0) return 0;
		return movePlaces;
	})

	console.log(oldScoreboard, scoreboard);
	console.log(distances);

	const elements = document.createDocumentFragment();
	for (let i = 0; i < scoreboard.length; i++) {
		const div = document.createElement("div");
		const names = document.createElement("div");
		const name = document.createElement("span");
		const team = document.createElement("span");
		const score = document.createElement("span");
		const points = document.createElement("span");

		names.className = "names"
		div.className = "scoreItem";
		name.className = "name";
		team.className = "team";
		score.className = "score";
		points.className = "points";

		name.innerText = scoreboard[i].name;
		score.innerText = scoreboard[i].score;
		points.innerText = "Points";
		team.innerText = `${scoreboard[i].team}`;

		if (pictureMode) {
			const img = document.createElement("img");
			img.src = `profiles/${scoreboard[i].number}.png`;
			div.appendChild(img);
		}

		names.appendChild(name);
		names.appendChild(team);

		div.appendChild(names);
		div.appendChild(score);
		div.appendChild(points);
		elements.appendChild(div);
	}
	document.getElementById("scoreboard").innerHTML = "";
	document.getElementById("scoreboard").appendChild(elements)

	if (globalStyles["animate"]) {
		if (globalStyles["layout-style"] == "bottom") {
			const scoresItems = document.getElementsByClassName("scoreItem");
			for (let i = 0; i < scoresItems.length; i++) {
				scoresItems[i].style.left = -1 * distances[i] * scoresItems[i].offsetWidth + "px";
			}

			// setTimeout(() => {
			// 	const scoresItems = document.getElementsByClassName("scoreItem");
			// 	for (let i = 0; i < scoresItems.length; i++) {
			// 		scoresItems[i].style.transition = "left 1s ease";
			// 		scoresItems[i].style.left = "0px";
			// 	}
			// }, 100)
		} else {
			const scoresItems = document.getElementsByClassName("scoreItem");
			for (let i = 0; i < scoresItems.length; i++) {
				scoresItems[i].style.top = -1 * distances[i] * scoresItems[i].offsetHeight + "px";
			}

			// setTimeout(() => {
			// 	const scoresItems = document.getElementsByClassName("scoreItem");
			// 	for (let i = 0; i < scoresItems.length; i++) {
			// 		scoresItems[i].style.transition = "top 1s ease";
			// 		scoresItems[i].style.top = "0px";
			// 	}
			// }, 100)
		}
	}
}

function updateStyle(styles) {
	for (const [style, value] of Object.entries(styles)) {
		if (style.endsWith("-size"))
			document.documentElement.style.setProperty('--' + style, value + "px");
		else if (style === "layout-style") {
			document.getElementById("scoreboard").className = value;
			pictureMode = value.startsWith("picture");
		}
		else
			document.documentElement.style.setProperty('--' + style, value);
	}
	updateScoreboard(globalScoreboard);
}

function sortScoreboard(scoreboard) {
	scoreboard.sort((a, b) => b.score - a.score);
	return scoreboard
}

window.addEventListener('obsSceneChanged', function (event) {
	if (event.detail.name == "scoreboard" && globalStyles["animate"]) {
		if (globalStyles["layout-style"] == "bottom") {
			setTimeout(() => {
				const scoresItems = document.getElementsByClassName("scoreItem");
				for (let i = 0; i < scoresItems.length; i++) {
					scoresItems[i].style.transition = "left 1s ease";
					scoresItems[i].style.left = "0px";
				}
			}, 2000)
		} else {
			setTimeout(() => {
				const scoresItems = document.getElementsByClassName("scoreItem");
				for (let i = 0; i < scoresItems.length; i++) {
					scoresItems[i].style.transition = "top 1s ease";
					scoresItems[i].style.top = "0px";
				}
			}, 2000)
		}

		oldScoreboard = globalScoreboard.slice();
	}
})