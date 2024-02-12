/*----- constants -----*/

const brickColors = {
    "Y": "#E9B824",
    "G": "#219C90",
    "O": "#E85112",
    "R": "#9f0000",
};



/*----- state variables -----*/


/*----- cached elements  -----*/
const grid = document.querySelector(".gameGrid");

// create a paddle
const paddle = document.createElement("div");
paddle.className = "paddle";
grid.appendChild(paddle);

// create a ball
const ball = document.createElement("div");
ball.className = "ball";
grid.appendChild(ball);



/*----- event listeners -----*/
document.addEventListener("keydown", movePaddle);

/*----- functions -----*/

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

let paddleSpeed = 10;
let distance = 135;

function movePaddle(event) {
    if(event.keyCode === 37) {
        if (distance > 0) {
            distance -= paddleSpeed;
            paddle.style.left = distance + 5 + "px";
        }
    } else if (event.keyCode === 39) {
        if (distance < 270) {
            distance += paddleSpeed;
            paddle.style.left = distance - 5 + "px"; 
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
    // paddleCollision();
};

function wallCollision() {
    if (leftPosition > maxLeft || leftPosition < minLeft) {
        leftDirection = -1 * leftDirection;
    };
    if (bottomPosition > maxBottom || bottomPosition < minBottom) {
        bottomDirection = -1 * bottomDirection;
    };
};

function brickCollision() {
    const bricks = [...document.querySelectorAll(".brickCell")];
    for (let brick of bricks) {
        brickLeftPosition = brick.offsetLeft;
        brickBottomPosition = maxBottom - brick.offsetTop;
        if (bottomPosition >= brickBottomPosition - 15 && leftPosition >= brickLeftPosition) {
            // try splice function to eliminate the brick
            bottomDirection = -1 * bottomDirection;
            leftDirection = -1 * leftDirection;
        };
    };
};