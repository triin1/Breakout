/*---------------------------------- constants ----------------------------------*/

const brickColors = {
    "Y": "#E9B824",
    "G": "#219C90",
    "O": "#E85112",
    "R": "#9f0000",
};

// paddle variables
let paddleSpeed = 35;
let paddleLeftDistance = 135;
let paddleBottomDistance = 0;
let paddleHeight = 15;
let paddleWidth = 90;

// ball variables
let ballBottomPosition = 15;
let ballLeftPosition = 175;
let maxLeft = 345;
let minLeft = 0;
let maxBottom = 345;
let ballBottomVelocity = 4;
let ballLeftVelocity = 4;
let ballDiameter = 15;

// brick variables
let brickHeight = 15;
let brickWidth = 30;

/*------------------------------- state variables -------------------------------*/

const state = {
    score: 0,
    lives: 0,
}

/*------------------------------- cached elements -------------------------------*/

const grid = document.querySelector(".gameGrid");

// create a paddle
const paddle = document.createElement("div");
paddle.className = "paddle";
grid.appendChild(paddle);

// create a ball
const ball = document.createElement("div");
ball.className = "ball";
grid.appendChild(ball);

let startButton = document.getElementById("start-button");

let resetButton = document.getElementById("reload-button");

let scoreCounter = document.getElementById("score");

let livesCounter = document.getElementById("lives");

/*------------------------------- event listeners -------------------------------*/

document.addEventListener("keydown", movePaddle);

startButton.addEventListener("click", function() {
    moveBall();
});

resetButton.addEventListener("click", function () {
    document.location.reload();
});

/*---------------------------------- functions ----------------------------------*/

function initialise() {
    state.score = 0;
    scoreCounter.innerHTML = state.score;
    state.lives = 3;
    livesCounter.innerHTML = state.lives;
};

// create the game grid
for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 12; column++) {
        const cell = document.createElement("div");
        cell.classList.add("brickCell");
        grid.appendChild(cell);
        if (row < 2) {
            cell.style.backgroundColor = brickColors.R;
        } else if (row < 4) {
            cell.style.backgroundColor = brickColors.O;
        } else if (row < 6) {
            cell.style.backgroundColor = brickColors.G;
        } else if (row < 8) {
            cell.style.backgroundColor = brickColors.Y;
        };
    };
};

function movePaddle(event) {
    if(event.keyCode === 37 || event.keyCode === 65) {
        if (paddleLeftDistance > 0) {
            paddleLeftDistance -= paddleSpeed;
            paddle.style.left = paddleLeftDistance + 5 + "px";
        };
    } else if (event.keyCode === 39 || event.keyCode === 68) {
        if (paddleLeftDistance < 270) {
            paddleLeftDistance += paddleSpeed;
            paddle.style.left = paddleLeftDistance - 5 + "px"; 
        };
    };
};

function moveBall() {
    checkCollision();
    ballBottomPosition = ballBottomPosition + ballBottomVelocity;
    ballLeftPosition = ballLeftPosition + ballLeftVelocity;
    ball.style.bottom = ballBottomPosition + "px";
    ball.style.left = ballLeftPosition + "px";
    requestAnimationFrame(moveBall);
};  

function checkCollision() {
    wallCollision();
    brickCollision();
    paddleCollision();
};

function wallCollision() {
    if (ballLeftPosition > maxLeft || ballLeftPosition < minLeft) {
        ballLeftVelocity = -1 * ballLeftVelocity;
    };
    if (ballBottomPosition > maxBottom) {
        ballBottomVelocity = -1 * ballBottomVelocity;
    };
};

const bricks = [...document.querySelectorAll(".brickCell")];

function brickCollision() {
    for (let brick of bricks) {
        brickLeftPosition = brick.offsetLeft;
        brickBottomPosition = maxBottom - brick.offsetTop;
        if (brickLeftPosition < ballLeftPosition + ballDiameter && brickLeftPosition + brickWidth > ballLeftPosition && brickBottomPosition < ballBottomPosition + ballDiameter && brickBottomPosition + brickHeight > ballBottomPosition && !brick.classList.contains("hidden")) {
            brick.classList.add("hidden");
            ballBottomVelocity = -1 * ballBottomVelocity;
            if (brickBottomPosition >= 330) {
                state.score += 7;
            } else if (brickBottomPosition >=300) {
                state.score += 5;
            } else if (brickBottomPosition >= 270) {
                state.score += 3;
            } else if (brickBottomPosition >= 240) {
                state.score +=1;
            };
            scoreCounter.innerHTML = state.score;
            checkWin();
            return
        };
    };
};

function paddleCollision() {
    if (ballBottomVelocity < 0 && paddleLeftDistance < ballLeftPosition + ballDiameter && paddleLeftDistance + paddleWidth > ballLeftPosition && paddleBottomDistance < ballBottomPosition + ballDiameter && paddleBottomDistance + paddleHeight > ballBottomPosition) {
        ballBottomVelocity = -1 * ballBottomVelocity;
        if (ballLeftPosition > paddleLeftDistance && ballLeftPosition < paddleLeftDistance + paddleWidth/2) {
            ballLeftVelocity = -1 * ballLeftVelocity;
        };
    } else if (ballBottomPosition < 0) {
        ballBottomVelocity = 0;
        ballLeftVelocity = 0;
        ball.classList.add("hidden");
        if (state.lives > 1) {
            state.lives = state.lives - 1;
            livesCounter.innerHTML = state.lives;
            ballBottomPosition = 15;
            ballLeftPosition = 175;
            ball.classList.remove("hidden");
            let countdown = document.createElement("div");
            countdown.classList.add("timer");
            grid.appendChild(countdown);
            countdown.innerHTML = 3;
            let secondsLeft = 3000;
            const intervalId = setInterval(function() {
                secondsLeft -= 1000;
                countdown.innerHTML = secondsLeft / 1000;    
                if (secondsLeft < 1000) {
                    countdown.classList.add("hidden");
                    ballBottomVelocity = 4;
                    ballLeftVelocity = 4;
                    clearInterval(intervalId); 
                };
            }, 1000);
        } else if (lives = 1) {
            let message = document.createElement("div");
            message.classList.add("message");
            message.innerHTML = "GAME OVER";
            grid.appendChild(message);
            state.lives = 0;
            livesCounter.innerHTML = state.lives;
        };
    };
};

function checkWin() {
    if (state.score === 384) {
        ballBottomVelocity = 0;
        ballLeftVelocity = 0;
        ball.classList.add("hidden");
        const message = document.createElement("div");
        message.classList.add("message");
        message.innerHTML = "GAME OVER <br> YOU WIN!";
        grid.appendChild(message);
        return;
    };
};

initialise();