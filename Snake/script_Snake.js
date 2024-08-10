window.onload = function() {
    console.log('Document loaded and script executed');

    let ws; // Объявляем WebSocket вне функций, чтобы избежать пересоздания

    // Функция для установки соединения WebSocket
    function setupWebSocket() {
        ws = new WebSocket('ws://127.0.0.1:8080');

        ws.addEventListener('open', function() {
            console.log('WebSocket connection established.');
            refreshServerList(); // Обновляем список серверов при подключении WebSocket
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
                    document.getElementById('server-selection').style.display = 'block';
                    refreshServerList(); // Обновляем список серверов после создания нового сервера
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
        removeServerFromList(server.id); // Удаляем старую запись
        addServerToList(server); // Добавляем новую
    }

    function joinServer(serverId) {
        console.log('Joining server with ID:', serverId);
        document.getElementById('server-selection').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        ws.send(JSON.stringify({ type: 'join', serverId }));
    }
};
