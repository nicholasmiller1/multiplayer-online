class Player {
    constructor(tetris) {
        this.DROP_SLOW = 1000;
        this.DROP_FAST = 50;
        this.PIECES = ['I','L','J','O','T','S','Z'];

        this.events = new Events;

        this.tetris = tetris;
        this.arena = tetris.arena;

        this.dropSpeed = this.DROP_SLOW;
        this.dropCounter = 0;
        this.dropInterval = this.dropSpeed;

        this.heldPiece = null;
        this.holdAvailability = true;

        this.pieceBag = shuffle(this.PIECES);
        this.pos = {x: 0, y: 0};
        this.matrix = null;
        this.score = 0;

        this.reset(true);
    }

    createPiece(type) {
        if (type === 'T') {
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        } else if (type === 'O') {
            return [
                [2, 2],
                [2, 2],
            ];
        } else if (type === 'L') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ];
        } else if (type === 'J') {
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ];
        } else if (type === 'I') {
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'Z') {
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0],
            ];
        }
    }

    drop() {
        this.pos.y++;
        this.dropCounter = 0;
        if (this.arena.collide(this)) {
            this.pos.y--;
            this.arena.merge(this);
            this.reset(true);
            this.score += this.arena.sweep();
            this.events.emit('score', this.score);

            this.dropSpeed = (Math.exp(-this.score / 100 * 0.25)) * this.DROP_SLOW;
            this.dropInterval = this.dropSpeed;
            console.log(this.dropInterval)
            return;
        }
        this.events.emit('pos', this.pos);
    }

    move(dir) {
        this.pos.x += dir;
        if (this.arena.collide(this)) {
            this.pos.x -= dir;
            return;
        }
        this.events.emit('pos', this.pos);
    }

    reset(newPiece) {
        if (newPiece) {
            if (this.pieceBag === undefined || this.pieceBag.length === 0) {
                this.pieceBag = shuffle(this.PIECES);
            }
            this.matrix = this.createPiece(this.pieceBag.pop());
            this.holdAvailability = true;
        }

        this.pos.y = 0;
        this.pos.x = (this.arena.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0);
        if (this.arena.collide(this)) {
            this.arena.clear();
            this.score = 0;
            this.heldPiece = null;
            this.holdAvailability = true;
            this.events.emit('score', this.score);
        }

        this.dropSpeed = this.DROP_SLOW;
        this.dropInterval = this.dropSpeed;

        this.events.emit('pos', this.pos);
        this.events.emit('matrix', this.matrix);
    }

    holdPiece() {
        if (this.holdAvailability) {
            if (this.heldPiece === null) {
                this.heldPiece = this.matrix;
                this.reset(true);
                this.holdAvailability = false;
                return;
            }

            const temp = this.matrix;
            this.matrix = this.heldPiece;
            this.heldPiece = temp;
            this.reset(false);
            this.holdAvailability = false;
        }
    }

    rotate(dir) {
        const pos = this.pos.x;
        let offset = 1;
        this._rotateMatrix(this.matrix, dir);
        while (this.arena.collide(this)) {
            this.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.matrix[0].length) {
                this._rotateMatrix(this.matrix, -dir);
                this.pos.x = pos;
                return;
            }
        }
        this.events.emit('matrix', this.matrix);
    }

    _rotateMatrix(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x]
                ] = [
                    matrix[y][x],
                    matrix[x][y]
                ];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    update(deltaTime) {
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }
    }
}

function shuffle(array) {
    let tempArray = [...array];
    let currentIndex = array.length
    let randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [tempArray[currentIndex], tempArray[randomIndex]] = [
        tempArray[randomIndex], tempArray[currentIndex]];
    }
  
    return tempArray;
  }