class Pong {
    constructor(element) {
        this.element = element;
        this.canvas = element.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = element.clientWidth * 0.75;
        this.canvas.height = element.clientHeight * 0.95;
        
        this.arena = new Arena(this.canvas.width, this.canvas.height);
        this.players = [];

        let lastTime = 0;
        this._update = (time = 0) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            this.arena.update(deltaTime);

            this.players.forEach(player => {
                player.move();
                this.arena.handleCollision(player)
            });

            this.draw();
            requestAnimationFrame(this._update);
        }
    }
    
    drawScore(player) {
        this.context.fillStyle = '#fff';
        this.context.font = '35px sans-serif';

        this.context.fillText((player.side === 0 ? 1 : 3) * this.arena.width / 4, this.arena.height / 6, player.score);
    }

    drawPaddle(player) {
        this.context.fillStyle = '#fff';
        this.context.fillRect(player.pos.x, player.pos.y, player.width, player.height);
    }

    drawBall(arena) {
        this.context.fillStyle = '#05edff';
        this.context.beginPath();
        this.context.arc(this.arena.ball.x, this.arena.ball.y, this.arena.ball.radius, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
    }

    draw() {
        // Draw Background
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.arena.width, this.arena.height);

        // Draw net
        const netWidth = 4;
        this.context.fillStyle = '#fff';
        this.context.fillRect(this.arena.width / 2 - netWidth / 2, 0, netWidth, this.arena.height);

        // Draw game features
        this.players.forEach(player => {
            this.drawScore(player);
            this.drawPaddle(player);
        })

        this.drawBall(this.arena);
    }

    run() {
        this._update();
    }

    addPlayer() {
        const player = new Player(this, this.players.length);
        this.players.push(player);
        return player;
    }

    removePlayer(player) {
        this.players = this.players.filter(p => p !== player);
    }

    removeLastPlayer() {
        this.removePlayer(this.players[this.players.length - 1]);
    }
}