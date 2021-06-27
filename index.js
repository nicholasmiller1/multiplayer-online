const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + "/public"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const connectedUsers = [];

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        const user = connectedUsers.find(x => x.socket === socket);
        io.to(user.roomId).emit('chat message', msg);
    });

    socket.on('join room', ({username, roomId}) => {
        connectedUsers.push({socket: socket, username: username, roomId: roomId});
        socket.join(roomId);

        setTimeout(() => {
            io.to(roomId).emit('chat message', username + " has joined the game");
        }, 1000)
    });

    socket.on('disconnect', () => {
        const user = connectedUsers.find(x => x.socket === socket);
        io.to(user.roomId).emit('chat message', user.username + " has left the game");
    })
});


server.listen(process.env.PORT || 3000, () => {
    console.log("server listening on port " + (process.env.PORT || 3000));
});