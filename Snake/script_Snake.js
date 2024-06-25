import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

let userId = null;
let bestScore = 0;

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');

if (uid) {
    loadUserProfile(uid);
} else {
    signInAnonymously(auth).then(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                loadBestScore();
            }
        });
    });
}

async function loadUserProfile(uid) {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${uid}`));
    if (snapshot.exists()) {
        const userData = snapshot.val();
        document.getElementById('profile').textContent = `Name: ${userData.name}, Email: ${userData.email}`;
    } else {
        document.getElementById('profile').textContent = 'No such user!';
    }
}

async function loadBestScore() {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/bestScore`));
    if (snapshot.exists()) {
        bestScore = snapshot.val();
        document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
    } else {
        bestScore = 0;
        document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
    }
}

async function updateBestScore(newScore) {
    if (newScore > bestScore) {
        bestScore = newScore;
        await set(ref(database, 'users/' + userId), { bestScore });
        document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
    }
}

// Логика игры Snake
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const snake = [{ x: 10, y: 10 }];
let direction = 'right';
let food = { x: 20, y: 20 };
let score = 0;
let speed = 10;

const scoreElement = document.getElementById('score');

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

document.addEventListener('keydown', event => {
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

window.onload = function () {
    generateFood();
    gameLoop();
};
