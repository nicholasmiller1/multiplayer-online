const socket = io();
const url = new URL(window.location.href);
const username = url.searchParams.get('username');
const roomId = url.searchParams.get('roomId');
socket.emit('join room', {username, roomId});

const gameName = roomId.split('-')[0];
const emptyCanvas = document.getElementsByClassName('canvas')[0];
emptyCanvas.id = gameName;
const gameScript = document.createElement('script');
gameScript.setAttribute('src', `./js/${gameName}-scripts.js`);
document.body.appendChild(gameScript);

const chat = document.getElementById('chat')
const chatMessages = document.getElementById('chat-messages');
const leaveButton = document.getElementById('leave-button');
const roomIdDisplay = document.getElementById('room-id');
const playerDisplay = document.getElementById('player-count');
roomIdDisplay.innerHTML = "Room Id: " + roomId.split('-')[1];

let localGameData = {};
let serverGameData = {};
let playerMax = 0;
let currentUsers = 0;

socket.on('user update', ({msg, numOfUsers}) => {
    if (numOfUsers > playerMax) {
        if (currentUsers === 0) {
            window.location.href = "/?alert=room-full";
        }
    } else {
        currentUsers = numOfUsers;
        playerDisplay.innerHTML = `Players: ${currentUsers}/${playerMax}`;

        const item = document.createElement('li');
        item.textContent = msg;
        chatMessages.appendChild(item);
        chat.scrollTop = chat.scrollHeight;

        if (currentUsers === playerMax) {
            setInterval(gameLoop, 1000 / 60);
        }
    }
});

socket.on('request data', () => {
    socket.emit('send data', localGameData);
})

socket.on('broadcast data', (data) => {
    serverGameData = data;
})

leaveButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "/";
})