class Arena {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.frameRate = 1000 / 60;
        this.frameCounter = 0;

        this.ball = {
            x: width / 2,
            y: height / 2,
            radius: 7,
            speed: 7,
            velocityX: 5,
            velocityY: 5
        }

        this.events = new Events;
    }

    reset() {
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.speed = 7;
        this.ball.velocityX = -this.ball.velocityX;
        this.ball.velocityY = -this.ball.velocityY;

        this.events.emit('ball', this.ball);
    }

    ballCollision(player) {
        player.top = player.y;
        player.right = player.x + player.width;
        player.bottom = player.y + player.height;
        player.left = player.x;

        const ballBox = {
            top: this.ball.y - this.ball.radius,
            right: this.ball.x + this.ball.radius,
            bottom: this.ball.y + this.ball.radius,
            left: this.ball.x - this.ball.radius
        };

        return ballBox.left < player.right
                && ballBox.top < player.bottom
                && ballBox.right > player.left
                && ballBox.bottom > player.top;
    }

    handleCollision(player) {
        if (this.ballCollision(player))  {
            let angle = 0;

            if (this.ball.y < (player.pos.y + player.height / 2)) {
                angle = -1 * Math.PI / 4;
            } else if (this.ball.y > (player.pos.y + player.height / 2)) {
                angle = Math.PI / 4;
            }

            this.ball.velocityX = (player.side === 0 ? 1 : -1) * this.ball.speed * Math.cos(angle);
            this.ball.velocityY = this.ball.speed * Math.sin(angle);

            this.ball.speed += 0.2;
        }
    }

    update(deltaTime) {
        this.frameCounter += deltaTime;
        if (this.frameCounter > this.frameRate) {
            this._update();
        }
    }

    _update() {
        // Ball bounce off walls
        if (this.ball.y + this.ball.radius >= this.height || this.ball.y - this.ball.radius <= 0) {
            this.ball.velocityY = -this.ball.velocityY;
        }

        if (this.ball.x + this.ball.radius >= this.width) {
            this.events.emit('score', 1);
            this.reset();
        }

        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
    }
}