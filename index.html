document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const startButton = document.querySelector('.start-button');
    let score = 0;
    let currentBlock;
    let grid = Array.from({ length: 20 }, () => Array(10).fill(0));
    let gameInterval;

    // Определение различных типов фигур и их цветов
    const blockTypes = [
        // Прямоугольник
        {
            shape: [[0, 0], [1, 0], [0, 1], [1, 1]],
            color: 'yellow'
        },
        // L-фигура
        {
            shape: [[0, 0], [0, 1], [0, 2], [1, 2]],
            color: 'orange'
        },
        // T-фигура
        {
            shape: [[0, 0], [1, 0], [2, 0], [1, 1]],
            color: 'purple'
        },
        // Z-фигура
        {
            shape: [[0, 0], [1, 0], [1, 1], [2, 1]],
            color: 'red'
        },
        // S-фигура
        {
            shape: [[1, 0], [2, 0], [0, 1], [1, 1]],
            color: 'green'
        },
        // L в обратную сторону
        {
            shape: [[1, 0], [1, 1], [1, 2], [0, 2]],
            color: 'blue'
        },
        // Заглавная T-фигура
        {
            shape: [[0, 1], [1, 0], [1, 1], [2, 1]],
            color: 'purple'
        },
        // Фигура 4 на 1
        {
            shape: [[0, 0], [1, 0], [2, 0], [3, 0]],
            color: 'cyan'
        },
    ];

    // Функция для перемещения фигуры влево
    function moveBlockLeft() {
        if (checkCollision('left')) {
            return; // Не перемещаем фигуру влево, если есть коллизия
        }
        currentBlock.x--;
        drawBlock();
    }

    // Функция для перемещения фигуры вправо
    function moveBlockRight() {
        if (checkCollision('right')) {
            return; // Не перемещаем фигуру вправо, если есть коллизия
        }
        currentBlock.x++;
        drawBlock();
    }

    // Функция для перемещения фигуры вниз
    function moveBlockDown() {
        if (checkCollision('down')) {
            fixBlock();
            createNewBlock(); // Создаем новую фигуру после заморозки текущей
            return;
        }
        currentBlock.y++;
        drawBlock();
    }

    // Функция для проверки коллизий при движении влево, вправо и вниз
    function checkCollision(direction) {
        const nextX = direction === 'left' ? currentBlock.x - 1 : direction === 'right' ? currentBlock.x + 1 : currentBlock.x;
        const nextY = direction === 'down' ? currentBlock.y + 1 : currentBlock.y;
        return currentBlock.type.some(cell => {
            const [x, y] = cell;
            const newX = nextX + x;
            const newY = nextY + y;
            if (newX < 0 || newX >= 10 || newY >= 20 || grid[newY][newX]) {
                return true; // есть коллизия
            }
            return false;
        });
    }

    // Функция для создания новой фигуры
    function createNewBlock() {
        const randomIndex = Math.floor(Math.random() * blockTypes.length);
        const randomType = blockTypes[randomIndex];

        // Удаляем все заполненные строки перед созданием новой фигуры
        removeFullRows();

        // Создаем новую фигуру с центром в середине верхней горизонтальной линии игрового поля
        const newBlock = {
            type: randomType.shape,
            color: randomType.color,
            x: 4, // начальное положение по горизонтали
            y: 0, // начальное положение по вертикали
        };

        currentBlock = newBlock;
        drawBlock();
    }

    // Функция для отрисовки текущей фигуры на игровом поле
    function drawBlock() {
        clearBoard(); // Очищаем предыдущее положение фигуры на игровом поле
        currentBlock.type.forEach(cell => {
            const [x, y] = cell;
            const blockElement = document.createElement('div');
            blockElement.classList.add('block');
            blockElement.style.gridColumn = currentBlock.x + x + 1; // добавляем 1, чтобы учесть смещение
            blockElement.style.gridRow = currentBlock.y + y + 1; // добавляем 1, чтобы учесть смещение
            blockElement.style.backgroundColor = currentBlock.color;
            gameBoard.appendChild(blockElement);
        });
        drawFrozenBlocks(); // Отрисовываем замороженные фигуры
    }

    // Функция для отрисовки замороженных фигур на игровом поле
    function drawFrozenBlocks() {
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    const blockElement = document.createElement('div');
                    blockElement.classList.add('block');
                    blockElement.style.gridColumn = x + 1; // добавляем 1, чтобы учесть смещение
                    blockElement.style.gridRow = y + 1; // добавляем 1, чтобы учесть смещение
                    blockElement.style.backgroundColor = 'gray'; // Цвет замороженной фигуры
                    gameBoard.appendChild(blockElement);
                }
            });
        });
    }

    // Функция для очистки игрового поля от текущей фигуры
    function clearBoard() {
        const blocks = document.querySelectorAll('.block');
        blocks.forEach(block => block.remove());
    }

// Функция для начала игры
function startGame() {
    console.log("Game started!"); // Добавляем отладочное сообщение
    createNewBlock();
    gameInterval = setInterval(moveBlockDown, 1000);
    startButton.classList.add('hidden'); // Скрываем кнопку "Старт" после начала игры
    console.log("Start button hidden:", startButton.classList.contains('hidden')); // Добавляем отладочное сообщение
}

    // Обработчик нажатия кнопки "Старт"
    startButton.addEventListener('click', () => {
        startGame();
        startButton.classList.add('hidden'); // Скрываем кнопку "Старт" после начала игры
    });

    // Обработчик нажатия клавиш клавиатуры для управления фигурой
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowLeft':
                moveBlockLeft();
                break;
            case 'ArrowRight':
                moveBlockRight();
                break;
            case 'ArrowDown':
                moveBlockDown();
                break;
            case 'ArrowUp':
                rotateBlock();
                break;
            default:
                break;
        }
    });

    // Функция для вращения фигуры
    function rotateBlock() {
        const rotatedBlock = {
            type: [], // Инициализируем пустой массив для новой формы фигуры
            color: currentBlock.color,
            x: currentBlock.x, // Координаты x остаются теми же
            y: currentBlock.y, // Координаты y остаются теми же
        };

        // Находим центральный блок фигуры
        let sumX = 0;
        let sumY = 0;
        for (let i = 0; i < currentBlock.type.length; i++) {
            sumX += currentBlock.type[i][0];
            sumY += currentBlock.type[i][1];
        }
        const centerX = sumX / currentBlock.type.length;
        const centerY = sumY / currentBlock.type.length;

        console.log("CenterX:", centerX, "CenterY:", centerY);

        // Проходим по каждой клетке текущей фигуры
        for (let i = 0; i < currentBlock.type.length; i++) {
            // Изменяем координаты x и y клетки при вращении
            const relativeX = currentBlock.type[i][0] - centerX;
            const relativeY = currentBlock.type[i][1] - centerY;
            const newX = Math.round(centerX - relativeY);
            const newY = Math.round(centerY + relativeX);
            rotatedBlock.type.push([newX, newY]);
        }

        console.log("Rotated block:", rotatedBlock);

        // Проверяем, не выходит ли новая фигура за границы поля или не пересекается ли с другими клетками
        if (!checkRotationCollision(rotatedBlock)) {
            // Обновляем текущую фигуру
            currentBlock.type = rotatedBlock.type;
            drawBlock(); // Отрисовываем обновленную фигуру
        }
    }

    // Функция для проверки коллизий при вращении фигуры
    function checkRotationCollision(rotatedBlock) {
        return rotatedBlock.type.some(cell => {
            const [x, y] = cell;
            const newX = rotatedBlock.x + x;
            const newY = rotatedBlock.y + y;
            if (newX < 0 || newX >= 10 || newY >= 20 || grid[newY][newX]) {
                return true; // есть коллизия
            }
            return false;
        });
    }

    // Функция для фиксации фигуры на игровом поле
    function fixBlock() {
        currentBlock.type.forEach(cell => {
            const [x, y] = cell;
            const newX = currentBlock.x + x;
            const newY = currentBlock.y + y;
            grid[newY][newX] = 1; // Фиксируем клетку на игровом поле
        });
        drawBlock(); // Отрисовываем замороженную фигуру
        removeFullRows(); // Удаляем заполненные строки
    }

    // Функция для удаления всех заполненных строк одновременно
    function removeFullRows() {
        let fullRows = [];
        for (let i = grid.length - 1; i >= 0; i--) {
            if (grid[i].every(cell => cell === 1)) {
                fullRows.push(i); // Запоминаем номера всех заполненных строк
            }
        }
        if (fullRows.length > 0) {
            score += fullRows.length * 100; // Увеличиваем счет за удаленные строки
            document.getElementById('score').innerText = score;

            // Увеличиваем уровень каждые 750 очков
            level = Math.floor(score / 750) + 1;
            document.getElementById('level').innerText = level;

            // Удаляем все заполненные строки и добавляем новые пустые строки
            fullRows.forEach(rowIndex => {
                grid.splice(rowIndex, 1);
                grid.unshift(Array(10).fill(0));
            });

            // Уменьшаем интервал движения фигур для увеличения скорости игры
            clearInterval(gameInterval);
            gameInterval = setInterval(moveBlockDown, 1000 - (level * 50)); // Уменьшаем интервал на 50 мс каждый уровень
        }
    }

    // Функция для стирания всех заполненных строк
    function clearFullRows() {
        let fullRowCount = 0;
        for (let y = grid.length - 1; y >= 0; y--) {
            if (grid[y].every(cell => cell === 1)) {
                grid.splice(y, 1);
                grid.unshift(Array(10).fill(0));
                fullRowCount++;
                y++; // После удаления строки, нужно проверить эту же строку заново
            }
        }
        if (fullRowCount > 0) {
            score += Math.pow(2, fullRowCount) * 100; // Увеличиваем счет за удаленные строки в зависимости от их количества
            document.getElementById('score').innerText = score;

            // Увеличиваем уровень каждые 750 очков
            level = Math.floor(score / 750) + 1;
            document.getElementById('level').innerText = level;

            // Уменьшаем интервал движения фигур для увеличения скорости игры
            clearInterval(gameInterval);
            gameInterval = setInterval(moveBlockDown, 1000 - (level * 50)); // Уменьшаем интервал на 50 мс каждый уровень
        }
    }
// Функция для удаления всех заполненных строк одновременно
function removeFullRows() {
    let fullRows = [];
    for (let i = grid.length - 1; i >= 0; i--) {
        if (grid[i].every(cell => cell === 1)) {
            fullRows.push(i); // Запоминаем номера всех заполненных строк
        }
    }
    if (fullRows.length > 0) {
        let multiplier = 1; // Коэффициент множителя для сгорания одновременно нескольких строк
        switch (fullRows.length) {
            case 2:
                multiplier = 1.5;
                break;
            case 3:
                multiplier = 2;
                break;
            case 4:
                multiplier = 2.5;
                break;
            default:
                break;
        }
        score += multiplier * 100; // Увеличиваем счет с учетом множителя
        document.getElementById('score').innerText = score;

        // Увеличиваем уровень каждые 750 очков
        level = Math.floor(score / 750) + 1;
        document.getElementById('level').innerText = level;

        // Удаляем все заполненные строки и добавляем новые пустые строки
        fullRows.forEach(rowIndex => {
            grid.splice(rowIndex, 1);
            grid.unshift(Array(10).fill(0));
        });

        // Уменьшаем интервал движения фигур для увеличения скорости игры
        clearInterval(gameInterval);
        gameInterval = setInterval(moveBlockDown, 1000 - (level * 50)); // Уменьшаем интервал на 50 мс каждый уровень

        // Повторно вызываем функцию для удаления оставшихся заполненных строк
        removeFullRows();
    }
}


// Вставляем этот код после обработчика нажатия клавиш для управления фигурой

// Функция для отображения кнопки рестарта
function showRestartButton() {
    const restartButton = document.querySelector('.restart-button');
    restartButton.classList.remove('hidden');
}

// Обработчик при достижении замороженных фигур верхней границы
function checkGameOver() {
    const topRow = grid[0]; // Получаем верхнюю строку игрового поля
    if (topRow.some(cell => cell === 1)) {
        clearInterval(gameInterval); // Останавливаем интервал игры
        showRestartButton(); // Отображаем кнопку рестарта
    }
}

// Обработчик проверки на конец игры
function handleGameEnd() {
    checkGameOver();
}

// Добавляем обработчик проверки на конец игры после создания новой фигуры
createNewBlock = () => {
    const randomIndex = Math.floor(Math.random() * blockTypes.length);
    const randomType = blockTypes[randomIndex];

    // Создаем новую фигуру с центром в середине верхней горизонтальной линии игрового поля
    const newBlock = {
        type: randomType.shape,
        color: randomType.color,
        x: 4, // начальное положение по горизонтали
        y: 0, // начальное положение по вертикали
    };

    currentBlock = newBlock;
    drawBlock();

    // Проверяем на конец игры при появлении новой фигуры
    handleGameEnd();
}

// Добавляем обработчик для кнопки рестарта
document.querySelector('.restart-button').addEventListener('click', () => {
    window.location.reload(); // Перезагружаем страницу при нажатии на кнопку рестарта
});


// Функция для обновления следующей фигуры
function updateNextBlock(nextType) {
    const nextBlockElement = document.getElementById('next-block');
    nextBlockElement.innerHTML = ''; // Очищаем содержимое блока
    nextType.shape.forEach(cell => {
        const [x, y] = cell;
        const blockElement = document.createElement('div');
        blockElement.classList.add('next-block-cell'); // Добавляем класс для стилизации
        blockElement.style.backgroundColor = nextType.color;
        nextBlockElement.appendChild(blockElement);
    });
}

// Добавляем обновление следующей фигуры при создании новой фигуры
createNewBlock = () => {
    const randomIndex = Math.floor(Math.random() * blockTypes.length);
    const randomType = blockTypes[randomIndex];

    // Обновляем следующую фигуру
    const nextRandomIndex = Math.floor(Math.random() * blockTypes.length);
    const nextRandomType = blockTypes[nextRandomIndex];
    updateNextBlock(nextRandomType);

    // Создаем новую фигуру с центром в середине верхней горизонтальной линии игрового поля
    const newBlock = {
        type: randomType.shape,
        color: randomType.color,
        x: 4, // начальное положение по горизонтали
        y: 0, // начальное положение по вертикали
    };

    currentBlock = newBlock;
    drawBlock();

    // Проверяем на конец игры при появлении новой фигуры
    handleGameEnd();
}



});
