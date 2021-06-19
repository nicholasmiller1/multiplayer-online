const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + "/public"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        const roomItr = socket.rooms.values();
        roomItr.next();
        io.to(roomItr.next().value).emit('chat message', msg);
    });

    socket.on('create user', ({username, roomId}) => {
        socket.join(roomId);

        setTimeout(() => {
            io.to(roomId).emit('chat message', username + " has entered the chat");
        }, 1000)
    });
});


server.listen(process.env.PORT || 3000, () => {
    console.log("server listening on port " + (process.env.PORT || 3000));
});