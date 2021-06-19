const socket = io();
const url = new URL(window.location.href);
const username = url.searchParams.get('username');
const roomId = url.searchParams.get('roomId');
socket.emit('create user', {username, roomId});

const messages = document.getElementById('chat-messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});