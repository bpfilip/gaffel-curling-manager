const { ipcMain, dialog } = require('electron');
const { getPlayers, addPlayer, removePlayer, renamePlayer, movePlayer, setPlayerIndex, changeTeamPlayer, changeNumberPlayer } = require("../services/players");

const fs = require("fs/promises");
const path = require("path");

function updatePlayers() {
	const players = getPlayers();
	ipcMain.emit("playersUpdated", players);
}

ipcMain.handle("getPlayers", (event, someArgument) => {
	const players = getPlayers();
	return players;
})

ipcMain.handle("addPlayer", (event, name) => {
	addPlayer(name)
	updatePlayers();
})

ipcMain.handle("renamePlayer", (event, args) => {
	renamePlayer(args.old, args.new);
	updatePlayers();
})

ipcMain.handle("changeTeamPlayer", (event, args) => {
	console.log(args);
	changeTeamPlayer(args.number, args.new);
	updatePlayers();
})

ipcMain.handle("changeNumberPlayer", (event, args) => {
	changeNumberPlayer(args.name, args.new);
	updatePlayers();
})

ipcMain.handle("removePlayer", (event, name) => {
	removePlayer(name);
	updatePlayers();
})

ipcMain.handle("setPlayerIndex", (event, args) => {
	setPlayerIndex(args.name, args.index);
	updatePlayers();
})

ipcMain.handle("movePlayer", (event, args) => {
	movePlayer(args.name, args.offset);
	updatePlayers();
})

ipcMain.on('filePicker', async (event, arg) => {
	const result = await dialog.showOpenDialog({ properties: ['openFile'] });

	if (result.canceled) return;

	await fs.copyFile(result.filePaths[0], path.resolve(__dirname, '../public/profiles/', arg + ".png"));

	updatePlayers();
})