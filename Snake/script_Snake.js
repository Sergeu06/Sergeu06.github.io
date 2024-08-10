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
console.log('Initializing Firebase app...');
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log('Firebase initialized.');

window.onload = function() {
    console.log('Document loaded and script executed');

    let ws; // Объявляем WebSocket вне функций, чтобы избежать пересоздания

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

            if (message.type === 'serverListUpdate') {
                console.log('Server list update received');
                updateServerList(message.servers);
            } else if (message.type === 'serverAdded') {
                console.log('New server added:', message.server);
                addServerToList(message.server);
            } else if (message.type === 'serverRemoved') {
                console.log('Server removed:', message.serverId);
                removeServerFromList(message.serverId);
            } else if (message.type === 'serverUpdated') {
                console.log('Server updated:', message.server);
                updateServerInList(message.server);
            } else if (message.type === 'playerListUpdate') {
                console.log('Player list update received');
                updatePlayerList(message.players); // Обновляем список игроков
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

    // Обработчик клика на кнопку создания сервера
    const createServerBtn = document.getElementById('openCreateServerModalBtn');
    if (createServerBtn) {
        createServerBtn.addEventListener('click', function() {
            console.log('Create Server button clicked');
            document.getElementById('serverCreationModal').style.display = 'block';
        });
    } else {
        console.error('Create Server button not found');
    }

    // Обработчик клика на кнопку создания сервера в модальном окне
    const createServerConfirmBtn = document.getElementById('createServerConfirmBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (createServerConfirmBtn) {
        createServerConfirmBtn.addEventListener('click', function() {
            console.log('Create Server Confirm button clicked');

            const serverName = document.getElementById('serverName').value;
            const passwordToggle = document.getElementById('passwordToggle').checked;
            const serverPassword = document.getElementById('serverPassword').value;
            const maxPlayers = document.getElementById('maxPlayers').value;
            const gameMode = document.getElementById('gameMode').value;

            console.log('Server details:', { serverName, passwordToggle, serverPassword, maxPlayers, gameMode });

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
                console.log('Create server response:', data);
                if (data.success) {
                    alert('Server created successfully!');
                    document.getElementById('serverCreationModal').style.display = 'none';
                    joinServer(data.serverId); // Автоматически подключаемся к созданному серверу
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
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('serverCreationModal').style.display = 'none';
        });
    } else {
        console.error('Close modal button not found');
    }

    // Обработчик клика на кнопку обновления списка серверов
    const refreshServersBtn = document.getElementById('refreshServersBtn');
    if (refreshServersBtn) {
        refreshServersBtn.addEventListener('click', function() {
            console.log('Refresh Servers button clicked');
            refreshServerList(); // Обновляем список серверов при клике
        });
    } else {
        console.error('Refresh Servers button not found');
    }

    // Обработчик клика на кнопку одиночного режима
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    if (singlePlayerBtn) {
        singlePlayerBtn.addEventListener('click', function() {
            console.log('Single Player button clicked');
            startGame();
        });
    } else {
        console.error('Single Player button not found');
    }

    // Обработчик клика на кнопку мультиплеера
    const multiPlayerBtn = document.getElementById('multiPlayerBtn');
    if (multiPlayerBtn) {
        multiPlayerBtn.addEventListener('click', function() {
            console.log('Multiplayer button clicked');
            startMultiplayer();
        });
    } else {
        console.error('Multiplayer button not found');
    }

    function startGame() {
        console.log('Starting single player game');
        document.querySelector('.mode-selection').style.display = 'none';
        document.querySelector('.game-container').style.display = 'block';
        initSinglePlayerGame(); // Предполагается, что функция уже определена
    }

    function startMultiplayer() {
        console.log('Starting multiplayer mode');
        document.querySelector('.mode-selection').style.display = 'none';
        document.getElementById('server-selection').style.display = 'block';
        refreshServerList(); // Обновляем список серверов при переходе в мультиплеерный режим
    }

    function refreshServerList() {
        console.log('Refreshing server list...');
        fetch('http://127.0.0.1:8080/api/servers')
            .then(response => response.json())
            .then(servers => {
                console.log('Server list fetched:', servers);
                updateServerList(servers);
            })
            .catch(error => {
                console.error('Error fetching server list:', error);
            });
    }

    function updateServerList(servers) {
        console.log('Updating server list UI...');
        const serverListElement = document.getElementById('serverList');
        serverListElement.innerHTML = '';
        servers.forEach(server => {
            console.log('Adding server to list:', server);
            addServerToList(server);
        });
    }

    function addServerToList(server) {
        console.log('Adding server to UI:', server);
        const serverListElement = document.getElementById('serverList');
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="server-name">${server.name}</div>
            <div class="server-details">Max Players: ${server.maxPlayers} | Mode: ${server.gameMode}</div>
            ${server.password ? '<span class="lock-icon">🔒</span>' : ''}
        `;
        li.addEventListener('click', () => {
            console.log('Server clicked:', server.id);
            joinServer(server.id);
        });
        serverListElement.appendChild(li);
    }

    function removeServerFromList(serverId) {
        console.log('Removing server from list:', serverId);
        const serverListElement = document.getElementById('serverList');
        const serverItems = serverListElement.querySelectorAll('li');
        serverItems.forEach(item => {
            if (item.getAttribute('data-server-id') === serverId) {
                console.log('Server found and removed:', serverId);
                serverListElement.removeChild(item);
            }
        });
    }

    function updateServerInList(server) {
        console.log('Updating server in list:', server);
        removeServerFromList(server.id); // Удаляем старую запись
        addServerToList(server); // Добавляем новую
    }

    function joinServer(serverId) {
        console.log('Joining server with ID:', serverId);
        document.getElementById('server-selection').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        ws.send(JSON.stringify({ type: 'join', serverId }));

        // Запрашиваем список игроков после подключения
        ws.send(JSON.stringify({ type: 'getPlayerList', serverId }));
    }

    function updatePlayerList(players) {
        console.log('Updating player list UI...');
        const playerListElement = document.getElementById('playerList');
        playerListElement.innerHTML = '';

        players.forEach(player => {
            console.log('Fetching data for player ID:', player.id);

            // Получаем данные пользователя из Firebase
            const userRef = ref(db, `users/${player.id}`);
            get(userRef).then(snapshot => {
                const userData = snapshot.val();
                console.log(`User data for ID ${player.id}:`, userData);

                const avatarUrl = userData?.avatar_url || 'default-avatar.png';
                const nickname = userData?.nickname || 'Unknown Player';

                console.log(`Displaying player ${nickname} with avatar: ${avatarUrl}`);
                
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
