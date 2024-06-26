import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
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
const auth = getAuth();
const database = getDatabase(app);

let userId = null;
let bestScore = 0;

// Extract UID and user nick from URL
const urlParams = new URLSearchParams(window.location.search);
const uidFromUrl = urlParams.get('uid');
const userNickFromUrl = urlParams.get('usernick');

// Display user nick
if (userNickFromUrl) {
    document.getElementById('profile').textContent = `Player: ${userNickFromUrl}`;
    console.log(`Player: ${userNickFromUrl}`);
}

if (uidFromUrl) {
    userId = uidFromUrl;
    loadBestScore(userId);
} else {
    signInAnonymously(auth).then(() => {
        console.log("Signed in anonymously");
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                console.log("User ID:", userId);
                loadBestScore(userId);
            } else {
                console.error("User is not signed in");
            }
        });
    }).catch((error) => {
        console.error("Error signing in anonymously: ", error);
    });
}

async function loadBestScore(uid) {
    const dbRef = ref(database);
    try {
        const snapshot = await get(child(dbRef, `users/${uid}/bestScore`));
        if (snapshot.exists()) {
            bestScore = snapshot.val();
            console.log("Loaded best score:", bestScore);
        } else {
            bestScore = 0;
            console.log("No best score found, setting to 0");
        }
        document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
    } catch (error) {
        console.error("Error loading best score: ", error);
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

// Game logic
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

window.onload = function () {
    generateFood();
    gameLoop();
};
