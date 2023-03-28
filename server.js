const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors")

const path = require('path');
const { getSettings } = require("./services/settings");

app.use(cors());
app.use(express.static(path.resolve(__dirname, 'public')));

io.on('connection', (socket) => {

});

server.listen(getSettings().port || 3000, () => {
	console.log('listening on *:' + (getSettings().port || 3000));
});

module.exports = { socketIO: io }