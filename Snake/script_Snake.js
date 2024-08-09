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

let selectedColor = '#333'; // Цвет по умолчанию

// Открытие и закрытие модального окна
const skinBtn = document.getElementById('skinBtn');
const skinModal = document.getElementById('skinModal');
const closeBtn = document.querySelector('.close');
const saveSkinBtn = document.getElementById('saveSkinBtn');

skinBtn.onclick = function() {
    skinModal.style.display = 'block';
}

closeBtn.onclick = function() {
    skinModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === skinModal) {
        skinModal.style.display = 'none';
    }
}

// Логика выбора цвета змеи
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
        selectedColor = this.dataset.color;
        document.querySelectorAll('.color-option').forEach(btn => btn.style.border = 'none');
        this.style.border = '2px solid black';
    });
});

// Сохранение выбранного цвета и закрытие модального окна
saveSkinBtn.onclick = function() {
    skinModal.style.display = 'none';
    console.log("Selected Snake Color: ", selectedColor);
}

// Логика игры

let snake = [{x: 150, y: 150}];
let direction = 'right';
let food = {x: 200, y: 200};
let score = 0;
let intervalId;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawSnake(snake, color) {
    ctx.fillStyle = color || selectedColor; // Используем выбранный цвет или стандартный
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
            ctx.fillStyle = selectedColor; // Восстанавливаем цвет после рисования глаз
        }
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function moveSnake() {
    let head = {x: snake[0].x, y: snake[0].y};
    
    switch (direction) {
        case 'right':
            head.x += 10;
            break;
        case 'left':
            head.x -= 10;
            break;
        case 'up':
            head.y -= 10;
            break;
        case 'down':
            head.y += 10;
            break;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * 40) * 10;
    food.y = Math.floor(Math.random() * 40) * 10;
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    
    return false;
}

function gameLoop() {
    if (checkCollision()) {
        clearInterval(intervalId);
        alert(`Game Over! Your score was: ${score}`);
        updateBestScore(score);  // Update the best score in Firebase
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake(snake, selectedColor);
    drawFood();
}

function startSinglePlayer() {
    score = 0;
    snake = [{x: 150, y: 150}];
    direction = 'right';
    generateFood();
    intervalId = setInterval(gameLoop, 100);
}

// Multiplayer logic

const spawnPoints = [
    { x: 10, y: 10, direction: 'right' },
    { x: 380, y: 10, direction: 'down' },
    { x: 380, y: 380, direction: 'left' },
    { x: 10, y: 380, direction: 'up' },
    { x: 200, y: 10, direction: 'down' },
    { x: 380, y: 200, direction: 'left' },
    { x: 200, y: 380, direction: 'up' },
    { x: 10, y: 200, direction: 'right' }
];

let snakes = Array(8).fill().map((_, i) => ({
    body: [{ x: spawnPoints[i].x, y: spawnPoints[i].y }],
    direction: spawnPoints[i].direction,
    color: selectedColor,
    started: false
}));

let multiplayerFood = [];
let multiplayerSpeed = 10;
let multiplayerScore = Array(8).fill(0);

function drawSnakeMultiplayer(snake) {
    drawSnake(snake.body, snake.color);
}

function moveSnakeMultiplayer(snake) {
    let head = { x: snake.body[0].x, y: snake.body[0].y };

    switch (snake.direction) {
        case 'right':
            head.x += 10;
            break;
        case 'left':
            head.x -= 10;
            break;
        case 'up':
            head.y -= 10;
            break;
        case 'down':
            head.y += 10;
            break;
    }

    snake.body.unshift(head);

    const foodIndex = multiplayerFood.findIndex(f => f.x === head.x && f.y === head.y);

    if (foodIndex !== -1) {
        multiplayerScore[snakes.indexOf(snake)] += 10;
        multiplayerFood.splice(foodIndex, 1);
        generateMultiplayerFood();
    } else {
        snake.body.pop();
    }
}

function generateMultiplayerFood() {
    const foodPosition = {
        x: Math.floor(Math.random() * 40) * 10,
        y: Math.floor(Math.random() * 40) * 10
    };
    multiplayerFood.push(foodPosition);
}

function checkCollisionMultiplayer(snake) {
    const head = snake.body[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[i].x === head.x && snake.body[i].y === head.y) {
            return true;
        }
    }

    return snakes.some(otherSnake => otherSnake !== snake && otherSnake.body.some(segment => segment.x === head.x && segment.y === head.y));
}

function gameLoopMultiplayer() {
    snakes.forEach(snake => {
        if (!checkCollisionMultiplayer(snake)) {
            moveSnakeMultiplayer(snake);
        }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snakes.forEach(drawSnakeMultiplayer);
    multiplayerFood.forEach(food => {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);
    });

    // Repeat the loop
    setTimeout(gameLoopMultiplayer, 1000 / multiplayerSpeed);
}

function startMultiplayer() {
    multiplayerScore = Array(8).fill(0);
    snakes.forEach((snake, index) => {
        snake.body = [{ x: spawnPoints[index].x, y: spawnPoints[index].y }];
        snake.direction = spawnPoints[index].direction;
        snake.color = selectedColor; // Присваиваем выбранный цвет
        snake.started = false;
    });
    multiplayerFood = [];
    multiplayerSpeed = 10;
    gameLoopMultiplayer();
}

// Контролы
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
