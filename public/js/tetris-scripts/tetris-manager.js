class TetrisManager {
    constructor(document) {
        this.document = document;
        this.template = this.document.querySelector('#player-template');
        
        this.instances = [];
    }

    createPlayer() {
        const element = document
            .importNode(this.template.content, true)
            .children[0];
        
            const tetris = new Tetris(element);
            this.document.appendChild(tetris.element);

            this.instances.push(tetris);
            return tetris;
    }

    removePlayer(tetris) {
        this.document.removeChild(tetris.element);

        this.instances = this.instances.filter(instance => instance !== tetris);
    }

    removeLastPlayer() {
        this.removePlayer(this.instances[this.instances.length - 1]);
    }

    sortPlayers(tetri) {
        tetri.forEach(tetris => {
            this.document.body.appendChild(tetris.element);
        })
    }
}