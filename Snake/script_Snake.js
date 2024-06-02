// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const snake = [{x: 10, y: 10}];
let direction = 'right';
let food = {x: 20, y: 20};
let score = 0;

function drawSnake() {
    ctx.fillStyle = '#333';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function moveSnake() {
    const head = {...snake[0]};
    switch(direction) {
        case 'up': head.y -= 10; break;
        case 'down': head.y += 10; break;
        case 'left': head.x -= 10; break;
        case 'right': head.x += 10; break;
    }
    snake.unshift(head);
    if(head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas.height / 10)) * 10
    };
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    // Add collision detection and game over logic here
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', event => {
    switch(event.key) {
        case 'ArrowUp': 
            if(direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if(direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if(direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if(direction !== 'left') direction = 'right';
            break;
    }
});

generateFood();
gameLoop();