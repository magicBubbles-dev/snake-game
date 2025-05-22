const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const rbutton = document.querySelector('#button');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const snakeColor = 'lightgreen';
const boardBackground =  'DarkRed';
const snakeBorder = 'black';
const foodColor = 'white';
const unitSize = 25;

let running = false;
let xVel = unitSize;
let yVel = 0; 
let tickTimeout;

let foodX;
let foodY;
let score = 0; 
let snake = [
    {x:unitSize*4, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
]; 

window.addEventListener('keydown', changeDirection);
rbutton.addEventListener('click', resetGame);

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
    
};

function nextTick(){
    if(running){
        tickTimeout = setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75)
    }
    else{
        displayGameOver();
    }
};

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0,0, gameWidth, gameHeight)
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max-min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
    
};

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){
    const head = {x: snake[0].x + xVel,
                y: snake[0].y + yVel};
    snake.unshift(head);
    
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY ){
        score += 1 
        scoreText.textContent = score;
        createFood() }
    else{
        snake.pop();           //not in tutorial
    }
};

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

function changeDirection(event){
    const keyPressed = event.keyCode; 
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    const goingUp = (yVel == -unitSize)
    const goingDown = (yVel == unitSize)
    const goingLeft = (xVel == -unitSize)
    const goingRight = (xVel == unitSize)

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVel = -unitSize
            yVel = 0 
            break;
        case(keyPressed == UP && !goingDown):
            xVel = 0
            yVel = -unitSize
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVel = unitSize
            yVel = 0 
            break;
        case(keyPressed == DOWN && !goingUp):
            xVel = 0
            yVel = unitSize
            break;
    }
};

function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false; 
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i += 1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};

function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!!", gameWidth / 2, gameHeight / 2);
    running = false;
};

function resetGame(){
    clearTimeout(tickTimeout);
    score = 0;
    xVel = unitSize;
    yVel = 0
    snake = [
        {x:unitSize*4, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ]; 
    gameStart();
};