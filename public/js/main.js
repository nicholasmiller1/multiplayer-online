const socket = io();
const url = new URL(window.location.href);
const roomId = url.searchParams.get('roomId');
const username = url.searchParams.get('username');
socket.emit('join room', {username, roomId});

const chat = document.getElementById('chat')
const chatMessages = document.getElementById('chat-messages');
const leaveButton = document.getElementById('leave-button');
const roomIdDisplay = document.getElementById('room-id');
const playerDisplay = document.getElementById('player-count');
roomIdDisplay.innerHTML = "Room Id: " + roomId.split('-')[1];

const playerMax = 2;
let gameLocal = null;
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

        updatePlayers(currentUsers);

        if (currentUsers === playerMax && gameLocal) {
            const waitingScreen = document.getElementById('waiting-screen');
            const waitingText = document.getElementById('waiting-text');
            waitingScreen.style.display = 'none';
            waitingText.style.display = 'none';
            
            gameLocal.run();
        }
    }
});

leaveButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "/";
})