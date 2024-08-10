window.onload = function() {
    console.log('Document loaded and script executed');

    // Настройка WebSocket
    let ws = new WebSocket('ws://127.0.0.1:8080');

    ws.addEventListener('open', function() {
        console.log('WebSocket connection established.');
        refreshServerList(); // Обновляем список серверов при подключении WebSocket
    });

    ws.addEventListener('message', function(event) {
        console.log('Message received:', event.data);
        const message = JSON.parse(event.data);

        if (message.type === 'serverListUpdate') {
            updateServerList(message.servers);
        }
    });

    ws.addEventListener('error', function(error) {
        console.error('WebSocket error:', error);
    });

    ws.addEventListener('close', function() {
        console.log('WebSocket connection closed.');
    });

    // Обработчик клика на кнопку создания сервера
    const createServerBtn = document.getElementById('openCreateServerModalBtn');
    console.log('Create Server button:', createServerBtn);

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

            console.log('Server Name:', serverName);
            console.log('Password Toggle:', passwordToggle);
            console.log('Server Password:', serverPassword);
            console.log('Max Players:', maxPlayers);
            console.log('Game Mode:', gameMode);

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
                console.log('Server creation response:', data);
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
    console.log('Refresh Servers button:', refreshServersBtn);

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
    console.log('Single Player button:', singlePlayerBtn);

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
    console.log('Multiplayer button:', multiPlayerBtn);

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

        ws = new WebSocket('ws://localhost:8080');

        ws.addEventListener('open', function() {
            console.log('WebSocket connection established for multiplayer.');
            refreshServerList(); // Обновляем список серверов при открытии соединения
        });

        ws.addEventListener('message', function(event) {
            console.log('Message received:', event.data);
            const message = JSON.parse(event.data);
            if (message.type === 'serverListUpdate') {
                updateServerList(message.servers);
            }
        });

        ws.addEventListener('error', function(error) {
            console.error('WebSocket error:', error);
        });

        ws.addEventListener('close', function() {
            console.log('WebSocket connection closed.');
        });
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
        console.log('Updating server list');
        const serverListElement = document.getElementById('serverList');
        serverListElement.innerHTML = '';
        servers.forEach(server => {
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
        });
    }

    function joinServer(serverId) {
        console.log('Joining server with ID:', serverId);
        document.getElementById('server-selection').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        ws.send(JSON.stringify({ type: 'join', serverId }));
    }
};
