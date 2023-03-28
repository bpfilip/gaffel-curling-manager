const path = require('path');

const { JsonDB } = require('node-json-db');
const Settings = new JsonDB(path.resolve(__dirname, 'settings.json'), true, true);
const Players = new JsonDB(path.resolve(__dirname, 'players.json'), true, true);
const Game = new JsonDB(path.resolve(__dirname, 'game.json'), true, true);

module.exports = { Settings, Players, Game };