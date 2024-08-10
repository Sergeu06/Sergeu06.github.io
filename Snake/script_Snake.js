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

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log('Firebase initialized.');

window.onload = function() {
    console.log('Document loaded and script executed');

    const userId = 'exampleUserId'; // Здесь используйте реальный userId
    let ws; // Объявляем WebSocket вне функций

    // Функция для установки соединения WebSocket
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

    // Функция для получения аватара игрока
    function fetchAndSetPlayerAvatar(userId) {
        console.log('Fetching player avatar for user ID:', userId);

        const userRef = ref(db, `users/${userId}`);
        get(userRef).then(snapshot => {
            const userData = snapshot.val();
            if (userData) {
                const avatarUrl = userData.avatar_url || 'https://via.placeholder.com/50';
                const avatarImg = document.getElementById('playerAvatarImg');
                if (avatarImg) {
                    avatarImg.src = avatarUrl;
                    avatarImg.onload = () => console.log('Avatar loaded successfully');
                    avatarImg.onerror = () => {
                        console.error('Failed to load avatar image, using default.');
                        avatarImg.src = 'https://via.placeholder.com/50';
                    };
                } else {
                    console.error('Player avatar element not found');
                }
            } else {
                console.error('No user data found');
            }
        }).catch(error => {
            console.error('Error fetching player data:', error);
        });
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
    const closeModalBtn = document.getElementById('closeModalBtn');
    const refreshServersBtn = document.getElementById('refreshServersBtn');
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    const multiPlayerBtn = document.getElementById('multiPlayerBtn');

    if (createServerConfirmBtn) {
        createServerConfirmBtn.addEventListener('click', () => {
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
                headers: {
                    'Content-Type': 'application/json'
                },
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
        });
    } else {
        console.error('Create Server Confirm button not found');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('serverCreationModal').style.display = 'none';
        });
    } else {
        console.error('Close modal button not found');
    }

    if (refreshServersBtn) {
        refreshServersBtn.addEventListener('click', refreshServerList);
    } else {
        console.error('Refresh Servers button not found');
    }

    if (singlePlayerBtn) {
        singlePlayerBtn.addEventListener('click', startGame);
    } else {
        console.error('Single Player button not found');
    }

    if (multiPlayerBtn) {
        multiPlayerBtn.addEventListener('click', startMultiplayer);
    } else {
        console.error('Multiplayer button not found');
    }

    // Функция для старта одиночной игры
    function startGame() {
        document.querySelector('.mode-selection').style.display = 'none';
        document.querySelector('.game-container').style.display = 'block';
        initSinglePlayerGame(); // Предполагается, что функция уже определена
    }

    // Функция для старта мультиплеерного режима
    function startMultiplayer() {
        document.querySelector('.mode-selection').style.display = 'none';
        document.getElementById('server-selection').style.display = 'block';
        refreshServerList();
    }

    // Функция для обновления списка серверов
    function refreshServerList() {
        console.log('Refreshing server list...');
        fetch('http://127.0.0.1:8080/api/servers')
            .then(response => response.json())
            .then(servers => {
                updateServerList(servers);
            })
            .catch(error => {
                console.error('Error fetching server list:', error);
            });
    }

    // Функция для обновления списка серверов в UI
    function updateServerList(servers) {
        const serverListElement = document.getElementById('serverList');
        serverListElement.innerHTML = '';
        servers.forEach(server => addServerToList(server));
    }

    // Функция для добавления сервера в список
    function addServerToList(server) {
        const serverListElement = document.getElementById('serverList');
        const li = document.createElement('li');
        li.setAttribute('data-server-id', server.id);
        li.innerHTML = `
            <div class="server-name">${server.name}</div>
            <div class="server-details">Max Players: ${server.maxPlayers} | Mode: ${server.gameMode}</div>
            ${server.password ? '<span class="lock-icon">🔒</span>' : ''}
        `;
        li.addEventListener('click', () => joinServer(server.id));
        serverListElement.appendChild(li);
    }

    // Функция для удаления сервера из списка
    function removeServerFromList(serverId) {
        const serverListElement = document.getElementById('serverList');
        const serverItems = serverListElement.querySelectorAll('li');
        serverItems.forEach(item => {
            if (item.getAttribute('data-server-id') === serverId) {
                serverListElement.removeChild(item);
            }
        });
    }

    // Функция для обновления информации о сервере
    function updateServerInList(server) {
        removeServerFromList(server.id);
        addServerToList(server);
    }

    // Функция для подключения к серверу
    function joinServer(serverId) {
        document.getElementById('server-selection').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        ws.send(JSON.stringify({ type: 'join', serverId }));

        // Запрашиваем список игроков после подключения
        ws.send(JSON.stringify({ type: 'getPlayerList', serverId }));

        // Получаем данные текущего пользователя для аватара
        if (userId) {
            fetchAndSetPlayerAvatar(userId);
        }
    }

    // Функция для обновления списка игроков в лобби
    function updatePlayerList(players) {
        const playerListElement = document.getElementById('playerList');
        playerListElement.innerHTML = '';

        players.forEach(player => {
            const userRef = ref(db, `users/${player.id}`);
            get(userRef).then(snapshot => {
                const userData = snapshot.val();
                const avatarUrl = userData?.avatar_url || 'https://via.placeholder.com/50';
                const nickname = userData?.nickname || 'Unknown Player';

                const li = document.createElement('li');
                li.classList.add('player-item');
                li.innerHTML = `
                    <img src="${avatarUrl}" alt="Avatar" class="player-avatar" />
                    <span class="player-name">${nickname}</span>
                `;
                playerListElement.appendChild(li);
            }).catch(error => {
                console.error('Error fetching player data:', error);
            });
        });
    }
};
