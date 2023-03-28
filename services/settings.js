const { Settings } = require("../db");

function getSettings() {
	return Settings.getData("/");
}

function updateSettings(settings) {
	const currentSettings = getSettings();
	Settings.push("/", { ...currentSettings, ...settings });
}

module.exports = { getSettings, updateSettings }