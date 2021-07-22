const form = document.getElementById("index-form");
const nameInput = document.getElementById("index-name");
const roomInput = document.getElementById("index-room");

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedGame = document.querySelector('input[type="radio"][name="game-select"]:checked').value;
    window.location.href = `/${selectedGame}.html?roomId=${selectedGame}-${roomInput.value}&username=${nameInput.value}`;
});

const url = new URL(window.location.href);
const alertSignal = url.searchParams.get('alert');
if (alertSignal === "room-full") {
    alert("The room you attempted to join is full");
}