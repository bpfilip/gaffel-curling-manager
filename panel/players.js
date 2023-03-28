const { ipcRenderer } = require('electron');

ipcRenderer.invoke("getPlayers")
	.then(updatePlayers);

ipcRenderer.on("playersUpdated", (event, players) => {
	updatePlayers(players);
})

let Players = [];

function updatePlayers(players) {
	Players = players;
	const elements = document.createDocumentFragment();
	for (let i = 0; i < players.length; i++) {
		const player = players[i]
		const div = document.createElement("div");
		const name = document.createElement("input");
		const team = document.createElement("input");
		const number = document.createElement("input");
		const img = document.createElement("img");
		const imgInput = document.createElement("input");
		const trash = document.createElement("img");

		img.src = `../public/profiles/${player.number}.png`;
		imgInput.type = "button";
		imgInput.value = "Image";

		imgInput.onclick = () => {
			ipcRenderer.send('filePicker', player.number)
		}

		div.className = "player";
		trash.src = "img/trashcan.svg";
		trash.className = "trash"

		name.value = player.name;
		name.addEventListener("input", (event) => {
			event.preventDefault();

			console.log("rename", player.name, event.target.value);
			ipcRenderer.invoke('renamePlayer', { old: player.number, new: event.target.value });
		});

		team.value = player.team;
		team.addEventListener("input", (event) => {
			event.preventDefault();

			ipcRenderer.invoke('changeTeamPlayer', { number: player.number, new: event.target.value });
		});

		number.type = "number"
		number.value = player.number;
		number.addEventListener("input", (event) => {
			event.preventDefault();

			ipcRenderer.invoke('changeNumberPlayer', { name: player.name, new: parseInt(event.target.value) });
		});

		trash.addEventListener("click", (event) => {
			console.log("remove", player.name);
			ipcRenderer.invoke('removePlayer', player.name);
		})

		const up = document.createElement("button");
		const down = document.createElement("button");

		up.addEventListener("click", (event) => {
			ipcRenderer.invoke("movePlayer", { name: player.name, offset: -1 })
		})

		down.addEventListener("click", (event) => {
			ipcRenderer.invoke("movePlayer", { name: player.name, offset: 1 })
		})

		if (i === 0) {
			up.disabled = true;
		}
		if (i === (players.length - 1)) {
			down.disabled = true;
		}

		up.innerText = "↑";
		down.innerText = "↓";

		div.appendChild(name);
		div.appendChild(team);
		div.appendChild(number);
		div.appendChild(up);
		div.appendChild(down);
		div.appendChild(img);
		div.appendChild(imgInput);
		div.appendChild(trash);
		elements.appendChild(div);
	}

	const div = document.createElement("div");
	const name = document.createElement("input");
	name.placeholder = "New player"
	name.addEventListener("keyup", (event) => {
		if (event.key === "Enter") {
			// Cancel the default action, if needed
			event.preventDefault();

			console.log("new player", event.target.value);
			ipcRenderer.invoke('addPlayer', event.target.value);
		}
	})
	div.appendChild(name);
	elements.appendChild(div);

	document.getElementById("players").replaceChildren(elements)
}

