document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const startButton = document.querySelector('.start-button');
    let score = 0;
    let level = 1;
    let currentBlock;
    let grid = Array.from({ length: 20 }, () => Array(10).fill(0));
    let gameInterval;

    // Определение различных типов фигур и их цветов
    const blockTypes = [
        // Прямоугольник
        {
            shape: [[0, 0], [1, 0], [0, 1], [1, 1]],
            color: 'cyan'
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
            color: 'yellow'
        },
        // Фигура 4 на 1
        {
            shape: [[0, 0], [1, 0], [2, 0], [3, 0]],
            color: 'pink'
        }
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
        createNewBlock();
        gameInterval = setInterval(moveBlockDown, 1000);
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

    // Функция для удаления заполненных строк
    function removeFullRows() {
        let fullRows = 0;
        for (let i = grid.length - 1; i >= 0; i--) {
            if (grid[i].every(cell => cell === 1)) {
                // Удаляем текущую строку из сетки
                grid.splice(i, 1);
                // Добавляем новую пустую строку в начало сетки
                grid.unshift(Array(10).fill(0));
                fullRows++;
            }
        }
        if (fullRows > 0) {
            score += fullRows * 100; // Увеличиваем счет за удаленные строки
            level = Math.floor(score / 1000) + 1; // Повышаем уровень каждые 1000 очков
            document.getElementById('score').innerText = score;
            document.getElementById('level').innerText = level;
        }
    }
});
