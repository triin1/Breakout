/*---------------------------------- constants ----------------------------------*/

const brickColors = {
    "Y": "#E9B824",
    "G": "#219C90",
    "O": "#E85112",
    "R": "#9f0000",
};

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

function initialise () {
    state.score = 0;
    scoreCounter.innerHTML = state.score;
    state.lives = 3;
    livesCounter.innerHTML = state.lives;
}

// create a game grid without having to set up individual <div>s in HTML
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

let paddleSpeed = 35;
let paddleLeftDistance = 135;

function movePaddle(event) {
    if(event.keyCode === 37 || event.keyCode === 65) {
        if (paddleLeftDistance > 0) {
            paddleLeftDistance -= paddleSpeed;
            paddle.style.left = paddleLeftDistance + 5 + "px";
        }
    } else if (event.keyCode === 39 || event.keyCode === 68) {
        if (paddleLeftDistance < 270) {
            paddleLeftDistance += paddleSpeed;
            paddle.style.left = paddleLeftDistance - 5 + "px"; 
        };
    };
};

// Ball movements
let ballSpeed = 1;
let bottomPosition = 15;
let leftPosition = 175;
let maxLeft = 345;
let minLeft = 0;
let maxBottom = 345;
let minBottom = 15;
let bottomDirection = 1;
let leftDirection = 1;


function moveBall() {
    clearInterval();
    setInterval(frame, ballSpeed);
    function frame() {
        checkCollision();
        bottomPosition = bottomPosition + bottomDirection;
        leftPosition = leftPosition + leftDirection;
        ball.style.bottom = bottomPosition + "px";
        ball.style.left = leftPosition + "px";
    };
};  

function checkCollision () {
    wallCollision();
    brickCollision();
    paddleCollision();
};

function wallCollision() {
    if (leftPosition > maxLeft || leftPosition < minLeft) {
        leftDirection = -1 * leftDirection;
    };
    if (bottomPosition > maxBottom) {
        bottomDirection = -1 * bottomDirection;
    };
};

const bricks = [...document.querySelectorAll(".brickCell")];

function brickCollision() {
    for (let brick of bricks) {
        brickLeftPosition = brick.offsetLeft;
        brickBottomPosition = maxBottom - brick.offsetTop;
        if (brickLeftPosition < leftPosition + 15 && brickLeftPosition + 30 > leftPosition && brickBottomPosition < bottomPosition + 15 && brickBottomPosition + 15 > bottomPosition && !brick.classList.contains("hidden")) {
        brick.classList.add("hidden");
        bottomDirection = -1 * bottomDirection;
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

function paddleCollision () {
    if (bottomDirection < 0 && paddleLeftDistance < leftPosition + 15 && paddleLeftDistance + 90 > leftPosition && 0 < bottomPosition + 15 && 15 > bottomPosition) {
        bottomDirection = -1 * bottomDirection;
        if (leftPosition > paddleLeftDistance && leftPosition < paddleLeftDistance + 45) {
            leftDirection = -1 * leftDirection;
        };
        } else if (bottomPosition < 0) {
        bottomDirection = 0;
        leftDirection = 0;
        ball.classList.add("hidden");
        if (state.lives > 1) {
            state.lives = state.lives - 1;
            livesCounter.innerHTML = state.lives;
            bottomPosition = 15;
            leftPosition = 175;
            ball.classList.remove("hidden");
            let countdown = document.createElement("div");
            countdown.classList.add("timer");
            grid.appendChild(countdown);
            countdown.innerHTML = 3;
            let secondsLeft = 3000;
            const intervalId = setInterval(function() {
                secondsLeft -= 1000;
                countdown.innerHTML = secondsLeft / 1000;    
                if (secondsLeft < 1) {
                    countdown.classList.add("hidden");
                    bottomDirection = 1;
                    leftDirection = 1;
                    clearInterval(intervalId); 
                };
            }, 1000);
            
            //setTimeout (continuePlay, 3000);
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

function checkWin () {
    if (state.score === 384) {
        bottomDirection = 0;
        leftDirection = 0;
        ball.classList.add("hidden");
        const message = document.createElement("div");
        message.classList.add("message");
        message.innerHTML = "GAME OVER";
        grid.appendChild(message);
    };
};

initialise();
