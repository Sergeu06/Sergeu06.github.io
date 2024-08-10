window.onload = function() {
    console.log('Document loaded and script executed');

    // Настройка WebSocket
    let ws = new WebSocket('ws://localhost:8080');

    ws.addEventListener('open', function() {
        console.log('WebSocket connection established.');
    });

    ws.addEventListener('message', function(event) {
        console.log('Message received:', event.data);
    });

    ws.addEventListener('error', function(error) {
        console.error('WebSocket error:', error);
    });

    ws.addEventListener('close', function() {
        console.log('WebSocket connection closed.');
    });

    // Обработчик клика на кнопку создания сервера
    const createServerBtn = document.getElementById('openCreateServerModalBtn');
    console.log('Create Server button:', createServerBtn); // Проверяем, найден ли элемент

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

            // Проверяем, что имя сервера введено
            if (!serverName) {
                console.error('Server name is required');
                return;
            }

            // Отправка данных на сервер
            fetch('/api/createServer', {
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
                console.log('Server creation response:', data); // Логируем ответ от сервера
                if (data.success) {
                    alert('Server created successfully!');
                    document.getElementById('serverCreationModal').style.display = 'none';
                    document.getElementById('server-selection').style.display = 'block';
                    if (ws) {
                        console.log('Sending refreshServers message');
                        ws.send(JSON.stringify({ type: 'refreshServers' }));
                    }
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
    console.log('Refresh Servers button:', refreshServersBtn); // Проверяем, найден ли элемент

    if (refreshServersBtn) {
        refreshServersBtn.addEventListener('click', function() {
            console.log('Refresh Servers button clicked');

            if (ws) {
                console.log('Sending refreshServers message');
                ws.send(JSON.stringify({ type: 'refreshServers' }));
            } else {
                console.error('WebSocket is not connected');
            }
        });
    } else {
        console.error('Refresh Servers button not found');
    }

    // Обработчик клика на кнопку одиночного режима
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    console.log('Single Player button:', singlePlayerBtn); // Проверяем, найден ли элемент

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
    console.log('Multiplayer button:', multiPlayerBtn); // Проверяем, найден ли элемент

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

        // Переопределяем ws переменную для WebSocket
        ws = new WebSocket('ws://localhost:8080');

        ws.addEventListener('open', function() {
            console.log('WebSocket connection established for multiplayer.');
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

    function initSinglePlayerGame() {
        console.log('Initializing single player game');
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        let snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}];
        let dx = 10;
        let dy = 0;
        let foodX;
        let foodY;

        function clearCanvas() {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }

        function drawSnakePart(snakePart) {
            ctx.fillStyle = "lightgreen";
            ctx.strokeStyle = "darkgreen";
            ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
            ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
        }

        function drawSnake() {
            snake.forEach(drawSnakePart);
        }

        function moveSnake() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            snake.unshift(head);
            snake.pop();
        }

        function generateFood() {
            foodX = Math.round((Math.random() * (canvas.width - 10)) / 10) * 10;
            foodY = Math.round((Math.random() * (canvas.height - 10)) / 10) * 10;
        }

        function drawFood() {
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'darkred';
            ctx.fillRect(foodX, foodY, 10, 10);
            ctx.strokeRect(foodX, foodY, 10, 10);
        }

        function main() {
            setTimeout(function onTick() {
                clearCanvas();
                drawFood();
                moveSnake();
                drawSnake();
                main();
            }, 100)
        }

        generateFood();
        main();
    }

    function updateServerList(servers) {
        console.log('Updating server list');
        const serverListElement = document.getElementById('serverList');
        serverListElement.innerHTML = '';
        servers.forEach(server => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${server.creatorAvatar || 'default-avatar.png'}" alt="Avatar">
                <div class="server-name">${server.name}</div>
                ${server.hasPassword ? '<span class="lock-icon">🔒</span>' : ''}
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
