const socket = io();
const url = new URL(window.location.href);
const username = url.searchParams.get('username');
const roomId = url.searchParams.get('roomId');
socket.emit('join room', {username, roomId});

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const leaveButton = document.getElementById('leave-button');

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

leaveButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "/";
})