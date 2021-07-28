const pong = new Pong(document.getElementById('game'));
const playerLocal = pong.addPlayer();
pong.run();

const updatePlayers = (playerCount) => {
    if (pong.players.length < playerCount) {
        pong.addPlayer();
    } else if (pong.players.length > playerCount) {
        pong.removeLastPlayer();
    }
}

const keyListener = (event) => {
    if (event.type === 'keydown') {
        switch (event.keyCode) {
            case 87:
                playerLocal.dir = 1;
                break;
            case 83:
                playerLocal.dir = -1;
                break;
        }
    } else if (event.type === 'keyup') {
        playerLocal.dir = 0;
    }
}

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);