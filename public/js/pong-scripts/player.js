class Player {
    constructor(pong, side) {
        this.height = 100;
        this.width = 10;

        this.events = new Events;

        this.pong = pong;
        this.arena = pong.arena;

        // side = 0 for left side and +1 for right side
        this.side = side;
        this.dir = 0;

        this.pos = {
            x: side ? this.arena.width - this.width - 10 : 10,
            y: this.arena.height / 2 - this.height / 2
        };

        this.score = 0;
    }

    move() {
        if (this.dir === 1 && this.pos.y > 0) {
            this.pos.y -= 8;
        } else if (this.dir === -1 && this.pos.y < (this.arena.height - this.height)) {
            this.pos.y += 8;
        }
        
        this.events.emit('pos', this.pos);
    }

    reset() {
        this.pos.y = this.arena.height / 2 - this.height / 2;
        this.dir = 0;

        this.events.emit('pos', this.pos);
    }
}