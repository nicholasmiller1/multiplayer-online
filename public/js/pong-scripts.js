const game = document.getElementById('game');
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
canvas.width = game.clientWidth * 0.75;
canvas.height = game.clientHeight * 0.95;

const paddleWidth = 10;
const paddleHeight = 100;
const userPaddleX = 10;
const opponentPaddleX = canvas.width - paddleWidth - 10;
playerMax = 2;

localGameData = {
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

serverGameData = {
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

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
    drawScore(canvas.width / 4, canvas.height / 6, localGameData.score);
    drawScore(3 * canvas.width / 4, canvas.height / 6, serverGameData.score);
    drawPaddle(userPaddleX, localGameData.y, paddleWidth, paddleHeight);
    drawPaddle(opponentPaddleX, serverGameData.y, paddleWidth, paddleHeight);
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
            upKey = true;
            break;
        case 40:
            downKey = true;
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
            upKey = false;
            break;
        case 40:
            downKey = false;
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
    player.right = player.x + paddleWidth;
    player.bottom = player.y + paddleHeight;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

function update() {
    // move user paddle
    if (upKey && localGameData.y > 0) {
        localGameData.y -= 8;
    } else if (downKey && (localGameData.y < canvas.height - paddleHeight)) {
        localGameData.y += 8;
    }

    // Check ball wall collision
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velocityY = -ball.velocityY;
    }

    if (ball.x + ball.radius >= canvas.width) {
        localGameData.score += 1;
        reset();
    }

    // move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // move opponent paddle
    // Handled by opponent client and received through socket

    // Check paddle collision
    let player = {};
    if (ball.x < canvas.width / 2) {
        player = localGameData;
        player.x = userPaddleX;
    } else {
        player = serverGameData;
        player.x = opponentPaddleX;
    }

    if (collisionDetect(player, ball)) {
        let angle = 0;

        if (ball.y < (player.y + paddleHeight / 2)) {
            angle = -1 * Math.PI / 4
        } else if (ball.y > (player.y + paddleHeight / 2)) {
            angle = Math.PI / 4;
        }

        ball.velocityX = (player === localGameData ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        ball.speed += 0.2;
    }
}

function gameLoop() {
    update();
    render();
}

setInterval(gameLoop, 1000 / 60);