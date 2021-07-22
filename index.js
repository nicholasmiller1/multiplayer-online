const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + "/public"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let connectedUsers = [];

io.on('connection', (socket) => {
    socket.on('join room', ({username, roomId}) => {
        connectedUsers.push({socket: socket, username: username, roomId: roomId});
        socket.join(roomId);

        let currentUsers = io.of("/").adapter.rooms.get(roomId);
        setTimeout(() => {
            io.to(roomId).emit('user update', {msg: username + " has joined the game", numOfUsers: currentUsers ? currentUsers.size : 0});
        }, 100)
    });

    socket.on('disconnect', () => {
        const user = connectedUsers.find(x => x.socket === socket);
        let currentUsers = io.of("/").adapter.rooms.get(user.roomId);
        io.to(user.roomId).emit('user update', {msg: user.username + " has left the game", numOfUsers: currentUsers ? currentUsers.size : 0});
    })

    socket.on('state update', (gameState) => {
        const user = connectedUsers.find(x => x.socket === socket);
        socket.to(user.roomId).emit('state update', gameState);
    })
});


server.listen(process.env.PORT || 3000, () => {
    console.log("server listening on port " + (process.env.PORT || 3000));
});