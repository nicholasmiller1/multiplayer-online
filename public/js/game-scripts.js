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

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const leaveButton = document.getElementById('leave-button');

let localGameData = {};
let serverGameData = {};

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (chatInput.value) {
        socket.emit('chat message', chatInput.value);
        chatInput.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    chatMessages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
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