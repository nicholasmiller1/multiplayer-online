const socket = io();

const form = document.getElementById("index-form");
const nameInput = document.getElementById("index-name");
const roomInput = document.getElementById("index-room");

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (nameInput.value && roomInput.value) {
        socket.emit('create user', {name: nameInput.value, roomId: roomInput.value});
        window.location.href = "./chat.html"
    }
});