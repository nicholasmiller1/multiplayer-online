const form = document.getElementById("index-form");
const nameInput = document.getElementById("index-name");
const roomInput = document.getElementById("index-room");

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (nameInput && roomInput) {
        const selectedGame = document.querySelector('input[type="radio"][name="game-select"]:checked').value;
        window.location.href = "/chat.html?roomId=" + selectedGame + "-" + roomInput.value + "&username=" + nameInput.value;
    }
});