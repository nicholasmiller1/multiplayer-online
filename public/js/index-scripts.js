const form = document.getElementById("index-form");
const nameInput = document.getElementById("index-name");
const roomInput = document.getElementById("index-room");

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (nameInput.value && roomInput.value) {
        window.location.href = "/chat.html?roomId=" + roomInput.value + "&username=" + nameInput.value;
    }
});