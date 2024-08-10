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


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.onload = function() {
    console.log('Document loaded and script executed');

    let ws;

    function setupWebSocket() {
        ws = new WebSocket('ws://127.0.0.1:8080');

        ws.addEventListener('open', function() {
            console.log('WebSocket connection established.');
            refreshServerList();
        });

        ws.addEventListener('message', function(event) {
            console.log('Message received:', event.data);
            const message = JSON.parse(event.data);

            if (message.type === 'serverListUpdate') {
                updateServerList(message.servers);
            } else if (message.type === 'serverAdded') {
                addServerToList(message.server);
            } else if (message.type === 'serverRemoved') {
                removeServerFromList(message.serverId);
            } else if (message.type === 'serverUpdated') {
                updateServerInList(message.server);
            } else if (message.type === 'playerListUpdate') {
                updatePlayerList(message.players);
            }
        });

        ws.addEventListener('error', function(error) {
            console.error('WebSocket error:', error);
        });

        ws.addEventListener('close', function() {
            console.log('WebSocket connection closed.');
        });
    }

    setupWebSocket();

    const createServerBtn = document.getElementById('openCreateServerModalBtn');
    if (createServerBtn) {
        createServerBtn.addEventListener('click', function() {
            console.log('Create Server button clicked');
            document.getElementById('serverCreationModal').style.display = 'block';
        });
    } else {
        console.error('Create Server button not found');
    }

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
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('serverCreationModal').style.display = 'none';
        });
    } else {
        console.error('Close modal button not found');
    }

    const refreshServersBtn = document.getElementById('refreshServersBtn');
    if (refreshServersBtn) {
        refreshServersBtn.addEventListener('click', function() {
            console.log('Refresh Servers button clicked');
            refreshServerList();
        });
    } else {
        console.error('Refresh Servers button not found');
    }

    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    if (singlePlayerBtn) {
        singlePlayerBtn.addEventListener('click', function() {
            console.log('Single Player button clicked');
            startGame();
        });
    } else {
        console.error('Single Player button not found');
    }

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
        initSinglePlayerGame();
    }

    function startMultiplayer() {
        console.log('Starting multiplayer mode');
        document.querySelector('.mode-selection').style.display = 'none';
        document.getElementById('server-selection').style.display = 'block';
        refreshServerList();
    }

    function refreshServerList() {
        fetch('http://127.0.0.1:8080/api/servers')
            .then(response => response.json())
            .then(servers => {
                updateServerList(servers);
            })
            .catch(error => {
                console.error('Error fetching server list:', error);
            });
    }

    function updateServerList(servers) {
        const serverListElement = document.getElementById('serverList');
        serverListElement.innerHTML = '';
        servers.forEach(server => {
            addServerToList(server);
        });
    }

    function addServerToList(server) {
        const serverListElement = document.getElementById('serverList');
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="server-name">${server.name}</div>
            <div class="server-details">Max Players: ${server.maxPlayers} | Mode: ${server.gameMode}</div>
            ${server.password ? '<span class="lock-icon">🔒</span>' : ''}
        `;
        li.addEventListener('click', () => {
            joinServer(server.id);
        });
        serverListElement.appendChild(li);
    }

    function removeServerFromList(serverId) {
        const serverListElement = document.getElementById('serverList');
        const serverItems = serverListElement.querySelectorAll('li');
        serverItems.forEach(item => {
            if (item.getAttribute('data-server-id') === serverId) {
                serverListElement.removeChild(item);
            }
        });
    }

    function updateServerInList(server) {
        removeServerFromList(server.id);
        addServerToList(server);
    }

    function joinServer(serverId) {
        console.log('Joining server with ID:', serverId);
        document.getElementById('server-selection').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        ws.send(JSON.stringify({ type: 'join', serverId }));

        // Запрашиваем список игроков после подключения
        ws.send(JSON.stringify({ type: 'getPlayerList', serverId }));
    }

    // Обновляем список игроков в лобби, загружая их данные из Firebase
    function updatePlayerList(players) {
        const playerListElement = document.getElementById('playerList');
        playerListElement.innerHTML = '';

        players.forEach(player => {
            // Получаем данные пользователя из Firebase
            const userRef = ref(db, `users/${player.id}`);
            get(userRef).then(snapshot => {
                const userData = snapshot.val();
                const avatarUrl = userData ? userData.avatarUrl : 'default-avatar.png';
                const nickname = userData ? userData.nickname : 'Unknown Player';

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

