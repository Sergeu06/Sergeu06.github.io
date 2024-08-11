import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

console.log('Firebase initialized.');

window.onload = function() {
    console.log('Document loaded and script executed');

    const avatarImg = document.getElementById('playerAvatarImg');
    let ws; // Объявляем WebSocket вне функций

    // Функция для извлечения параметра `uid` из URL
    function getUidFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('uid');
    }

    // Извлекаем `uid` из URL
    const uid = getUidFromUrl();
    console.log("Extracted UID:", uid);

    // Функция загрузки данных пользователя из Firebase
    async function loadUserData(uid) {
        console.log("Attempting to load user data for UID:", uid);
        const dbRef = ref(database);
        try {
            const snapshot = await get(child(dbRef, `users/${uid}`));
            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log("User data loaded:", userData);
                return userData;
            } else {
                console.error("User data not found");
                return null;
            }
        } catch (error) {
            console.error("Error loading user data: ", error);
            return null;
        }
    }

    // Функция для установки аватара пользователя
    async function setPlayerAvatar() {
        if (!uid) {
            console.error("No UID found in URL.");
            return;
        }

        const userData = await loadUserData(uid);
        if (userData) {
            const avatarUrl = userData.avatar_url;
            if (avatarUrl) {
                if (avatarImg) {
                    avatarImg.src = avatarUrl;
                    avatarImg.onload = () => console.log("Avatar loaded successfully");
                    avatarImg.onerror = () => {
                        console.error("Failed to load avatar image, using default.");
                        avatarImg.src = 'https://via.placeholder.com/50';
                    };
                } else {
                    console.error("Avatar image element not found");
                }
            } else {
                if (avatarImg) {
                    avatarImg.src = 'https://via.placeholder.com/50';
                }
            }
        } else {
            console.error("No user data found or failed to load");
        }
    }

    // Функция для настройки WebSocket соединения
    function setupWebSocket() {
        console.log('Setting up WebSocket connection...');
        ws = new WebSocket('ws://127.0.0.1:8080');

        ws.addEventListener('open', function() {
            console.log('WebSocket connection established.');
            refreshServerList(); // Обновляем список серверов при подключении WebSocket
        });

        ws.addEventListener('message', function(event) {
            console.log('WebSocket message received:', event.data);
            const message = JSON.parse(event.data);

            switch (message.type) {
                case 'serverListUpdate':
                    console.log('Server list update received');
                    updateServerList(message.servers);
                    break;
                case 'serverAdded':
                    console.log('New server added:', message.server);
                    addServerToList(message.server);
                    break;
                case 'serverRemoved':
                    console.log('Server removed:', message.serverId);
                    removeServerFromList(message.serverId);
                    break;
                case 'serverUpdated':
                    console.log('Server updated:', message.server);
                    updateServerInList(message.server);
                    break;
                case 'playerListUpdate':
                    console.log('Player list update received');
                    updatePlayerList(message.players);
                    break;
                default:
                    console.warn('Unknown message type:', message.type);
            }
        });

        ws.addEventListener('error', function(error) {
            console.error('WebSocket error:', error);
        });

        ws.addEventListener('close', function() {
            console.log('WebSocket connection closed.');
        });
    }

    // Инициализация WebSocket при загрузке страницы
    setupWebSocket();

    // Загрузка аватара пользователя
    if (avatarImg) {
        setPlayerAvatar();
    }

    // Обработчики кликов на кнопки
    const createServerBtn = document.getElementById('openCreateServerModalBtn');
    if (createServerBtn) {
        createServerBtn.addEventListener('click', () => {
            document.getElementById('serverCreationModal').style.display = 'block';
        });
    } else {
        console.error('Create Server button not found');
    }

    const createServerConfirmBtn = document.getElementById('createServerConfirmBtn');
    if (createServerConfirmBtn) {
        createServerConfirmBtn.addEventListener('click', handleServerCreation);
    } else {
        console.error('Create Server Confirm button not found');
    }

    const refreshServersBtn = document.getElementById('refreshServersBtn');
    if (refreshServersBtn) {
        refreshServersBtn.addEventListener('click', refreshServerList);
    } else {
        console.error('Refresh Servers button not found');
    }

    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('serverCreationModal').style.display = 'none';
        });
    } else {
        console.error('Close Modal button not found');
    }

    const passwordToggle = document.getElementById('passwordToggle');
    const serverPassword = document.getElementById('serverPassword');
    if (passwordToggle && serverPassword) {
        passwordToggle.addEventListener('change', () => {
            serverPassword.style.display = passwordToggle.checked ? 'block' : 'none';
        });
    } else {
        console.error('Password toggle or server password input not found');
    }

    // Функция для создания сервера
    function handleServerCreation() {
        const serverName = document.getElementById('serverName').value;
        const passwordToggle = document.getElementById('passwordToggle').checked;
        const serverPassword = document.getElementById('serverPassword').value;
        const maxPlayers = document.getElementById('maxPlayers').value;
        const gameMode = document.getElementById('gameMode').value;

        if (!serverName) {
            console.error('Server name is required');
            return;
        }

        fetch('http://127.0.0.1:8080/api/createServer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: serverName,
                password: passwordToggle ? serverPassword : null,
                maxPlayers: maxPlayers,
                gameMode: gameMode
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Server created successfully!');
                document.getElementById('serverCreationModal').style.display = 'none';
                joinServer(data.serverId);
            } else {
                alert('Error creating server');
            }
        })
        .catch(error => {
            console.error('Error creating server:', error);
        });
    }

    // Функция для присоединения к серверу
    function joinServer(serverId) {
        document.getElementById('server-selection').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        ws.send(JSON.stringify({ type: 'join', serverId }));

        // Запрашиваем список игроков после подключения
        ws.send(JSON.stringify({ type: 'getPlayerList', serverId }));

        // Устанавливаем информацию о первом игроке
        setFirstPlayerInfo();
    }

    // Функция для установки информации о первом игроке
    async function setFirstPlayerInfo() {
        const userData = await loadUserData(uid); // Загружаем данные пользователя

        if (userData) {
            const playerListElement = document.getElementById('playerList');
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            playerItem.innerHTML = `
                <div class="player-number">1</div>
                <div class="player-nickname">${userData.nickname || 'Player 1'}</div>
                <img class="player-avatar" src="${userData.avatar_url || 'https://via.placeholder.com/50'}" alt="Avatar">
            `;
            playerListElement.appendChild(playerItem);
        }
    }

    // Функции для работы с сервером
    function updateServerList(servers) {
        const serverListElement = document.getElementById('serverList');
        serverListElement.innerHTML = '';
        servers.forEach(server => addServerToList(server));
    }

    function addServerToList(server) {
        const serverListElement = document.getElementById('serverList');
        const serverItem = document.createElement('div');
        serverItem.className = 'server-item';
        serverItem.innerHTML = `
            <div class="server-name">${server.name}</div>
            <div class="server-mode">${server.gameMode}</div>
            <div class="server-players">${server.players.length}/${server.maxPlayers}</div>
        `;
        serverItem.addEventListener('click', () => joinServer(server.id));
        serverListElement.appendChild(serverItem);
    }

    function removeServerFromList(serverId) {
        const serverListElement = document.getElementById('serverList');
        const serverItems = serverListElement.getElementsByClassName('server-item');
        for (const serverItem of serverItems) {
            if (serverItem.dataset.id === serverId) {
                serverListElement.removeChild(serverItem);
                break;
            }
        }
    }

    function updateServerInList(server) {
        const serverListElement = document.getElementById('serverList');
        const serverItems = serverListElement.getElementsByClassName('server-item');
        for (const serverItem of serverItems) {
            if (serverItem.dataset.id === server.id) {
                serverItem.querySelector('.server-name').textContent = server.name;
                serverItem.querySelector('.server-mode').textContent = server.gameMode;
                serverItem.querySelector('.server-players').textContent = `${server.players.length}/${server.maxPlayers}`;
                break;
            }
        }
    }

    function updatePlayerList(players) {
        const playerListElement = document.getElementById('playerList');
        playerListElement.innerHTML = '';
        players.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            playerItem.innerHTML = `
                <div class="player-number">${index + 1}</div>
                <div class="player-nickname">${player.nickname || `Player ${index + 1}`}</div>
                <img class="player-avatar" src="${player.avatar_url || 'https://via.placeholder.com/50'}" alt="Avatar">
            `;
            playerListElement.appendChild(playerItem);
        });
    }

    function refreshServerList() {
        console.log('Refreshing server list...');
        ws.send(JSON.stringify({ type: 'getServerList' }));
    }

    // Запуск одиночной игры
    const startSingleplayerBtn = document.getElementById('startSingleplayerBtn');
    if (startSingleplayerBtn) {
        startSingleplayerBtn.addEventListener('click', () => {
            document.getElementById('mode-selection').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
        });
    } else {
        console.error('Singleplayer Start button not found');
    }
};
