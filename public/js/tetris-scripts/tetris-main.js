const tetrisManager = new TetrisManager(document.getElementById('game'));
gameLocal = tetrisManager.createPlayer();
gameLocal.element.classList.add('local');
// gameLocal.run();

const player = gameLocal.player;
['pos', 'matrix', 'score'].forEach(key => {
    player.events.listen(key, () => {
        socket.emit('state update', {
            fragment: 'player',
            state: [key, player[key]]
        });
    });
});

const arena = gameLocal.arena;
['matrix'].forEach(key => {
    arena.events.listen(key, () => {
        socket.emit('state update', {
            fragment: 'arena',
            state: [key, arena[key]]
        });
    });
});

socket.on('state update', (data) => {
    const tetris = tetrisManager.instances[1];
    const [key, value] = data.state;
    tetris[data.fragment][key] = value;

    if (key === 'score') {
        tetris.updateScore(value);
    } else {
        tetris.draw();
    }

    console.log(data.state);
})

const updatePlayers = (playerCount) => {
    if (tetrisManager.instances.length < playerCount) {
        while (tetrisManager.instances.length < playerCount) {
            tetrisManager.createPlayer();
        }
    } else if (tetrisManager.instances.length > playerCount) {
        while (tetrisManager.instances.length > playerCount) {
            tetrisManager.removeLastPlayer();
        }
    }
}

const keyListener = (event) => {
    [
        [65, 68, 81, 69, 83, 32],
    ].forEach((key, index) => {
        const player = gameLocal.player;
        if (event.type === 'keydown') {
            if (event.keyCode === key[0]) {
                player.move(-1);
            } else if (event.keyCode === key[1]) {
                player.move(1);
            } else if (event.keyCode === key[2]) {
                player.rotate(-1);
            } else if (event.keyCode === key[3]) {
                player.rotate(1);
            } else if (event.keyCode === key[5]) {
                player.holdPiece();
            }
        }

        if (event.keyCode === key[4]) {
            if (event.type === 'keydown') {
                if (player.dropInterval !== player.DROP_FAST) {
                    player.drop();
                    player.dropInterval = player.DROP_FAST;
                }
            } else {
                player.dropInterval = player.dropSpeed;
            }
        }
    });
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);