const game = document.getElementById('game');
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
canvas.width = game.clientWidth * 0.75;
canvas.height = game.clientHeight * 0.8;

const paddleWidth = 10;
const paddleHeight = 100;

const user = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0
};

const opponent = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5
}

let upKey = false;
let downKey = false;

let opponentUpKey = false;
let opponentDownKey = false;

function drawScore(x, y, score) {
    context.fillStyle = "#FFF";
    context.font = "35px sans-serif";

    context.fillText(score, x, y);
}

function drawPaddle(x, y, width, height) {
    context.fillStyle = "#FFF";
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
    context.fillStyle = "#05EDFF";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
}

function render() {
    // Draw black background
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw net
    const netWidth = 4;
    context.fillStyle = "#FFF";
    context.fillRect(canvas.width / 2 - netWidth / 2, 0, netWidth, canvas.height);

    // Draw game features
    drawScore(canvas.width / 4, canvas.height / 6, user.score);
    drawScore(3 * canvas.width / 4, canvas.height / 6, opponent.score);
    drawPaddle(user.x, user.y, user.width, user.height);
    drawPaddle(opponent.x, opponent.y, opponent.width, opponent.height);
    drawBall(ball.x, ball.y, ball.radius);
}

window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    switch (event.keyCode) {
        case 87:
            upKey = true;
            break;
        case 83:
            downKey = true;
            break;
        case 38:
            opponentUpKey = true;
            break;
        case 40:
            opponentDownKey = true;
            break;
    }
}

function keyUpHandler(event) {
    switch (event.keyCode) {
        case 87:
            upKey = false;
            break;
        case 83:
            downKey = false;
            break;
        case 38:
            opponentUpKey = false;
            break;
        case 40:
            opponentDownKey = false;
            break;
    }
}

function reset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

function collisionDetect(player, ball) {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

function update() {
    // move user paddle
    if (upKey && user.y > 0) {
        user.y -= 8;
    } else if (downKey && (user.y < canvas.height - user.height)) {
        user.y += 8;
    }

    // Check ball wall collision
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velocityY = -ball.velocityY;
    }

    if (ball.x + ball.radius >= canvas.width) {
        user.score += 1;
        reset();
    }

    if (ball.x - ball.radius <= 0) {
        opponent.score += 1;
        reset();
    }

    // move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // move opponent paddle
    if (opponentUpKey && opponent.y > 0) {
        opponent.y -= 8;
    } else if (opponentDownKey && (opponent.y < canvas.height - opponent.height)) {
        opponent.y += 8;
    }

    // Check paddle collision
    let player = (ball.x < canvas.width / 2) ? user : opponent;

    if (collisionDetect(player, ball)) {
        let angle = 0;

        if (ball.y < (player.y + player.height / 2)) {
            angle = -1 * Math.PI / 4
        } else if (ball.y > (player.y + player.height / 2)) {
            angle = Math.PI / 4;
        }

        ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        ball.speed += 0.2;
    }
}

function gameLoop() {
    update();
    render();
}

setInterval(gameLoop, 1000 / 60);