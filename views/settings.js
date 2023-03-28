const { ipcMain } = require('electron');
const { socketIO: io } = require("../server");
const { getSettings, updateSettings } = require("../services/settings");

ipcMain.handle('getSettings', (event, args) => {
	return getSettings();
})

ipcMain.handle('updateSettings', (event, settings) => {
	updateSettings(settings);
})

ipcMain.handle("updateScoreboardStyles", (event, styles) => {
	const settings = getSettings();
	settings.scoreboardStyles = styles;
	updateSettings(settings);
	io.of("/scoreboard").emit("stylesChanged", styles)
})

ipcMain.handle("updateLowerthirdStyles", (event, styles) => {
	const settings = getSettings();
	settings.lowerThirdStyles = styles;
	updateSettings(settings);
	io.of("/lowerThird").emit("stylesChanged", styles)
})