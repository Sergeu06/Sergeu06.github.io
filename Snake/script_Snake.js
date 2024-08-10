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
                avatarImg.classList.add('avatar');
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
    if (newScore > bestScore) {
        bestScore = newScore;
        try {
            await set(ref(database, `users/${userId}/bestScore`), bestScore);
            document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
        } catch (error) {
            console.error("Error updating best score: ", error);
        }
    }
}

// Game mode selection logic
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

// Single Player Logic
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
    if (!gameStarted) return;
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

// Single Player Controls
document.addEventListener('keydown', event => {
    gameStarted = true;
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

function startSinglePlayer() {
    generateFood();
    gameLoop();
}

// Multiplayer Logic
const snakes = [
    {
        body: [{ x: 10, y: 10 }],
        direction: 'right',
        color: '#333',
        started: false
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
    if (!snake.started) return;
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
    let newFoodPosition;
    while (true) {
        newFoodPosition = {
            x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
            y: Math.floor(Math.random() * (canvas.height / 10)) * 10
        };
        if (!snakes.some(snake => snake.body.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y))) {
            break;
        }
    }
    multiplayerFood.push(newFoodPosition);
}

function multiplayerGameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snakes.forEach(drawSnakeMultiplayer);
    multiplayerFood.forEach(food => {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);
    });
    snakes.forEach(moveSnakeMultiplayer);
    document.getElementById('score').textContent = `Score P1: ${multiplayerScore[0]}, P2: ${multiplayerScore[1]}`;
    setTimeout(multiplayerGameLoop, 1000 / multiplayerSpeed);
}

// Multiplayer Controls
document.addEventListener('keydown', event => {
    if (event.key === 'w' || event.key === 'ArrowUp') {
        snakes[0].started = true;
        if (event.key === 'w' && snakes[0].direction !== 'down') snakes[0].direction = 'up';
        if (event.key === 'ArrowUp' && snakes[1].direction !== 'down') snakes[1].direction = 'up';
    }
    if (event.key === 's' || event.key === 'ArrowDown') {
        if (event.key === 's' && snakes[0].direction !== 'up') snakes[0].direction = 'down';
        if (event.key === 'ArrowDown' && snakes[1].direction !== 'up') snakes[1].direction = 'down';
    }
    if (event.key === 'a' || event.key === 'ArrowLeft') {
        if (event.key === 'a' && snakes[0].direction !== 'right') snakes[0].direction = 'left';
        if (event.key === 'ArrowLeft' && snakes[1].direction !== 'right') snakes[1].direction = 'left';
    }
    if (event.key === 'd' || event.key === 'ArrowRight') {
        if (event.key === 'd' && snakes[0].direction !== 'left') snakes[0].direction = 'right';
        if (event.key === 'ArrowRight' && snakes[1].direction !== 'left') snakes[1].direction = 'right';
    }
});

function startMultiplayer() {
    generateMultiplayerFood();
    multiplayerGameLoop();
}
