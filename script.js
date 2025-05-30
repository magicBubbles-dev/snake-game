const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const rbutton = document.querySelector('#button');
const sbutton = document.querySelector('#start')

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const snakeColor = 'lightgreen';
const boardBackground = 'DarkRed';
const snakeBorder = 'black';
const foodColor = 'white';
const unitSize = 25;

const gameOver = new Audio('game-over2.mp3');
const gameBegins = new Audio('snake-game.mp3');


let running = false;
let xVel = unitSize;
let yVel = 0; 
let tickTimeout;

let foodX;
let foodY;
let score = 0; 
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
]; 

window.addEventListener('keydown', changeDirection);
rbutton.addEventListener('click', resetGame);
sbutton.addEventListener('click', startGame);

rbutton.style.display = 'none';   
drawInitialBoardAndSnake();       

function startGame() {    
    score = 0;
    xVel = unitSize;
    yVel = 0;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];

    sbutton.style.display = 'none';
    rbutton.style.display = 'inline-block';
    
    gameStart();
}

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    clearBoard();
    drawFood();
    drawSnake();
    nextTick();
    gameBegins.play();
}

function drawInitialBoardAndSnake() {
    clearBoard();
    drawSnake();
}

function nextTick() {
    if (running) {
        tickTimeout = setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
    
    // Make sure food doesn't spawn on snake
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === foodX && snake[i].y === foodY) {
            createFood();
            return;
        }
    }
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVel,
        y: snake[0].y + yVel
    };
    snake.unshift(head);
    
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode; 
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    const goingUp = (yVel === -unitSize);
    const goingDown = (yVel === unitSize);
    const goingLeft = (xVel === -unitSize);
    const goingRight = (xVel === unitSize);

    switch(true) {
        case (keyPressed === LEFT && !goingRight):
            xVel = -unitSize;
            yVel = 0;
            break;
        case (keyPressed === UP && !goingDown):
            xVel = 0;
            yVel = -unitSize;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVel = unitSize;
            yVel = 0;
            break;
        case (keyPressed === DOWN && !goingUp):
            xVel = 0;
            yVel = unitSize;
            break;
    }
}

function checkGameOver() {
    // Check wall collision
    if (snake[0].x < 0 || 
        snake[0].x >= gameWidth || 
        snake[0].y < 0 || 
        snake[0].y >= gameHeight) {
        running = false;
    }

    // Check self collision (start from 1 to skip head)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
            break;
            
        }
    }
    
}

function displayGameOver() {
    let isVisible = true;
    const blinks = 300;

    running = false;
    gameBegins.pause();
    gameBegins.currentTime = 0;
    gameOver.play();

    // Initial static text
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!!", gameWidth / 2, gameHeight / 2);

    // Start blinking effect
    blinkText = setInterval(() => {
        clearBoard();
        if (isVisible) {
            ctx.font = "50px MV Boli";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER!!", gameWidth / 2, gameHeight / 2);
        }
        isVisible = !isVisible;
    }, blinks);

    // Stop blinking after 3 seconds
    setTimeout(() => {
        clearInterval(blinkText);
        blinkText = null;

        // Draw final static message
        clearBoard();
        ctx.font = "50px MV Boli";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER!!", gameWidth / 2, gameHeight / 2);
    }, 3000);
}


function resetGame() {
    clearTimeout(tickTimeout);
    if (blinkText) {
        clearInterval(blinkText);
        blinkText = null;
    }

    running = false;
    score = 0;
    xVel = unitSize;
    yVel = 0;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    scoreText.textContent = score;

    sbutton.style.display = 'inline-block';
    rbutton.style.display = 'none';

    drawInitialBoardAndSnake();
}   