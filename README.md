Дебаг\- Перенос БД в лаунчер\- Добавление кликера- Добавление QR кодов- Допил игр

Кликер=Стиилстика- Создание UI- Добавлени простых мехпнник(клик, вкладки, прокачка)

Мультиплеер змейки - выбор режима - логика игры + цвета - изменение головного блока змеи - удары стены и тд
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Snake Game</title>
    <link rel="stylesheet" href="styles_Snake.css">
</head>
<body>
    <div class="mode-selection">
        <h2>Select Game Mode</h2>
        <button id="singlePlayerBtn">Single Player</button>
        <button id="multiPlayerBtn">Multiplayer</button>
    </div>
    <div class="game-container" style="display: none;">
        <canvas id="gameCanvas" width="400" height="400"></canvas>
        <div id="score">Score: 0</div>
        <div id="best-score">Best Score: 0</div>
    </div>
    <div id="profile"></div>
    <div class="controls" style="display: none;">
        <button id="up" class="control-btn">↑</button>
        <div class="horizontal-controls">
            <button id="left" class="control-btn">←</button>
            <button id="down" class="control-btn">↓</button>
            <button id="right" class="control-btn">→</button>
        </div>
    </div>

    <script type="module" src="script_Snake.js"></script>
</body>
</html>
















import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0SXNWUjftNziCo-TImzA1ksA8w8n-Rfc",
    authDomain: "snake-6da20.firebaseapp.com",
    databaseURL: "https://snake-6da20-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "snake-6da20",
    storageBucket: "snake-6da20.appspot.com",
    messagingSenderId: "792222318675",
    appId: "1:792222318675:web:5ecacccf554824a7ef46a6",
    measurementId: "G-P9R1G79S57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let userId = null;
let bestScore = 0;

// Extract UID from URL
const urlParams = new URLSearchParams(window.location.search);
const uidFromUrl = urlParams.get('uid');

if (uidFromUrl) {
    userId = uidFromUrl;
    loadUserData(userId);
} else {
    console.error("No UID found in URL");
}

async function loadUserData(uid) {
    const dbRef = ref(database);
    try {
        const snapshot = await get(child(dbRef, `users/${uid}`));
        if (snapshot.exists()) {
            const userData = snapshot.val();
            bestScore = userData.bestScore || 0;
            const userNick = userData.nickname || "Unknown";
            const avatarUrl = userData.avatar_url || "";

            document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
            document.getElementById('profile').textContent = `Player: ${userNick}`;
            
            if (avatarUrl) {
                const avatarImg = document.createElement('img');
                avatarImg.src = avatarUrl;
                avatarImg.alt = `${userNick}'s avatar`;
                avatarImg.style.width = "50px";  // Adjust size as needed
                avatarImg.style.height = "50px"; // Adjust size as needed
                document.getElementById('profile').appendChild(avatarImg);
            }
        } else {
            console.error("User data not found");
        }
    } catch (error) {
        console.error("Error loading user data: ", error);
    }
}

async function updateBestScore(newScore) {
    console.log("Attempting to update best score:", newScore);
    if (newScore > bestScore) {
        bestScore = newScore;
        try {
            await set(ref(database, `users/${userId}/bestScore`), bestScore);
            console.log("Updated best score to:", bestScore);
            document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
        } catch (error) {
            console.error("Error updating best score: ", error);
        }
    }
}

// Добавление логики выбора режима игры
document.getElementById('singlePlayerBtn').addEventListener('click', () => {
    startGame('single');
});

document.getElementById('multiPlayerBtn').addEventListener('click', () => {
    startGame('multi');
});

function startGame(mode) {
    document.querySelector('.mode-selection').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    document.querySelector('.controls').style.display = 'block';
    
    if (mode === 'single') {
        startSinglePlayer();
    } else if (mode === 'multi') {
        startMultiplayer();
    }
}

// Основная игровая логика для одиночного режима
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 10, y: 10 }];
let direction = 'right';
let food = { x: 20, y: 20 };
let score = 0;
let speed = 10;
let gameStarted = false;

const scoreElement = document.getElementById('score');

function drawSnake() {
    ctx.fillStyle = '#333';
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
        if (index === 0) {
            // Рисуем глаза на голове змеи
            ctx.fillStyle = 'white';
            if (direction === 'right' || direction === 'left') {
                ctx.fillRect(segment.x + 2, segment.y + 2, 2, 2);
                ctx.fillRect(segment.x + 2, segment.y + 6, 2, 2);
            } else {
                ctx.fillRect(segment.x + 2, segment.y + 2, 2, 2);
                ctx.fillRect(segment.x + 6, segment.y + 2, 2, 2);
            }
            ctx.fillStyle = '#333';
        }
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function moveSnake() {
    if (!gameStarted) return; // Ожидаем нажатия на клавишу для начала движения
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y -= 10; break;
        case 'down': head.y += 10; break;
        case 'left': head.x -= 10; break;
        case 'right': head.x += 10; break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        speed *= 1.05;
        console.log("Food eaten, new score:", score);
        updateBestScore(score);
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    let newFoodPosition;
    while (true) {
        newFoodPosition = {
            x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
            y: Math.floor(Math.random() * (canvas.height / 10)) * 10
        };
        if (!snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) {
            break;
        }
    }
    food = newFoodPosition;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    scoreElement.textContent = `Score: ${score}`;
    setTimeout(gameLoop, 1000 / speed);
}

// Управление для одиночного режима
document.addEventListener('keydown', event => {
    gameStarted = true; // Игра начинается после первого нажатия на клавишу
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Начало одиночной игры
function startSinglePlayer() {
    generateFood();
    gameLoop();
}

// Логика мультиплеерного режима
const snakes = [
    {
        body: [{ x: 10, y: 10 }],
        direction: 'right',
        color: '#333',
        started: false // Указывает, начала ли эта змея двигаться
    },
    {
        body: [{ x: 30, y: 30 }],
        direction: 'left',
        color: '#007700',
        started: false
    }
];

let multiplayerFood = [];
let multiplayerScore = [0, 0];
let multiplayerSpeed = 10;

function drawSnakeMultiplayer(snake) {
    ctx.fillStyle = snake.color;
    snake.body.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
        if (index === 0) {
            // Рисуем глаза на голове змеи
            ctx.fillStyle = 'white';
            if (snake.direction === 'right' || snake.direction === 'left') {
                ctx.fillRect(segment.x + 2, segment.y + 2, 2, 2);
                ctx.fillRect(segment.x + 2, segment.y + 6, 2, 2);
            } else {
                ctx.fillRect(segment.x + 2, segment.y + 2, 2, 2);
                ctx.fillRect(segment.x + 6, segment.y + 2, 2, 2);
            }
            ctx.fillStyle = snake.color;
        }
    });
}

function moveSnakeMultiplayer(snake) {
    if (!snake.started) return; // Ожидаем начала движения
    const head = { ...snake.body[0] };
    switch (snake.direction) {
        case 'up': head.y -= 10; break;
        case 'down': head.y += 10; break;
        case 'left': head.x -= 10; break;
        case 'right': head.x += 10; break;
    }
    snake.body.unshift(head);
    const foodIndex = multiplayerFood.findIndex(f => f.x === head.x && f.y === head.y);
    if (foodIndex !== -1) {
        multiplayerScore[snakes.indexOf(snake)]++;
        multiplayerFood.splice(foodIndex, 1);
        multiplayerSpeed *= 1.05;
        generateMultiplayerFood();
    } else {
        snake.body.pop();
    }
}

function generateMultiplayerFood() {
    if (multiplayerFood.length < 2) {
        let newFoodPosition;
        while (true) {
            newFoodPosition = {
                x: Math.floor(Math.random() * canvas.width / 10) * 10,
                y: Math.floor(Math.random() * canvas.height / 10) * 10
            };
            if (!snakes.some(snake => snake.body.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) &&
                !multiplayerFood.some(food => food.x === newFoodPosition.x && food.y === newFoodPosition.y)) {
                break;
            }
        }
        multiplayerFood.push(newFoodPosition);
    }
}

function checkCollisionMultiplayer(snake) {
    const head = snake.body[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake.body.length; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
            return true;
        }
    }

    return false;
}

function gameLoopMultiplayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let snake of snakes) {
        moveSnakeMultiplayer(snake);
        drawSnakeMultiplayer(snake);

        if (checkCollisionMultiplayer(snake)) {
            alert(`Game Over! Snake ${snakes.indexOf(snake) + 1} lost.`);
            return;
        }
    }

    multiplayerFood.forEach(food => {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);
    });

    generateMultiplayerFood();

    scoreElement.textContent = `Scores: Snake 1: ${multiplayerScore[0]}, Snake 2: ${multiplayerScore[1]}`;
    setTimeout(gameLoopMultiplayer, 1000 / multiplayerSpeed);
}

function startMultiplayer() {
    multiplayerScore = [0, 0];
    snakes.forEach(snake => {
        snake.body = [{ x: Math.floor(Math.random() * canvas.width / 10) * 10, y: Math.floor(Math.random() * canvas.height / 10) * 10 }];
        snake.direction = 'right';
        snake.started = false; // Устанавливаем, что змея ещё не начала движение
    });
    multiplayerFood = [];
    multiplayerSpeed = 10;
    gameLoopMultiplayer();
}

// Управление для мультиплеерного режима
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (snakes[0].direction !== 'down') snakes[0].direction = 'up';
            snakes[0].started = true; // Начинаем движение змеи
            break;
        case 'ArrowDown':
            if (snakes[0].direction !== 'up') snakes[0].direction = 'down';
            snakes[0].started = true;
            break;
        case 'ArrowLeft':
            if (snakes[0].direction !== 'right') snakes[0].direction = 'left';
            snakes[0].started = true;
            break;
        case 'ArrowRight':
            if (snakes[0].direction !== 'left') snakes[0].direction = 'right';
            snakes[0].started = true;
            break;
        case 'w':
            if (snakes[1].direction !== 'down') snakes[1].direction = 'up';
            snakes[1].started = true;
            break;
        case 's':
            if (snakes[1].direction !== 'up') snakes[1].direction = 'down';
            snakes[1].started = true;
            break;
        case 'a':
            if (snakes[1].direction !== 'right') snakes[1].direction = 'left';
            snakes[1].started = true;
            break;
        case 'd':
            if (snakes[1].direction !== 'left') snakes[1].direction = 'right';
            snakes[1].started = true;
            break;
    }
});

// JavaScript код для обработки двойного нажатия
document.addEventListener('dblclick', function(event) {
    event.preventDefault(); // Отключает стандартное действие двойного нажатия
});

document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'down') direction = 'up';
});

document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'up') direction = 'down';
});

document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'right') direction = 'left';
});

document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'left') direction = 'right';
});




















body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
}

.mode-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.mode-selection button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 1.2em;
    cursor: pointer;
    margin: 10px;
}

.mode-selection button:hover {
    background-color: #555;
}

.game-container {
    position: relative;
    border: 5px solid #333;
    background-color: #fff;
    width: 90vw;
    height: 90vw;
    max-width: 600px;
    max-height: 600px;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
}

#score, #best-score {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 5px;
    font-size: 1.2em;
}

#best-score {
    top: 10px;
    right: 10px;
    left: auto;
}

.controls {
    margin-top: 20px;
    text-align-last: center;
}

.control-btn {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 10px;
    font-size: 2em;
    margin: 5px;
    cursor: pointer;
}

.control-btn:hover {
    background-color: #555;
}

.horizontal-controls {
    display: flex;
    justify-content: center;
}

#profile {
    margin-top: 10px;
    font-size: 1.2em;
    display: flex;
    align-items: center;
}

#profile img.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: 10px;
}
