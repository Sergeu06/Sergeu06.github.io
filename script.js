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




document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.game-btn');
    const overlay = document.getElementById('overlay');
    const newPageContent = document.getElementById('new-page-content');

    // Извлекаем UID из текущего URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');

    if (!uid) {
        document.body.innerHTML = "<h1>UID not found in URL. Please start the game from Telegram.</h1>";
        return;
    }

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const rect = button.getBoundingClientRect();
            const buttonStyle = getComputedStyle(button);
            const bgColor = buttonStyle.backgroundColor;

            button.style.setProperty('--btn-top', `${rect.top}px`);
            button.style.setProperty('--btn-left', `${rect.left}px`);
            button.style.setProperty('--btn-width', `${rect.width}px`);
            button.style.setProperty('--btn-height', `${rect.height}px`);
            button.style.setProperty('--btn-bg-color', bgColor);

            button.classList.add('active');
            overlay.classList.add('show');

            setTimeout(() => {
                newPageContent.classList.add('show');
                setTimeout(() => {
                    let url = button.getAttribute('data-url');
                    if (url.includes('?')) {
                        url += `&uid=${uid}`;
                    } else {
                        url += `?uid=${uid}`;
                    }
                    window.location.href = url;
                }, 1000); // Время для завершения анимации контента
            }, 1000); // Время для завершения анимации кнопки и overlay
        });
    });
});
