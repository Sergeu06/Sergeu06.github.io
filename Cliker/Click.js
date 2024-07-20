document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM полностью загружен и разобран');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const notification = document.getElementById('notification');
    const baseUpgrades = document.getElementById('baseUpgrades');

    let damagePerClick = 1;
    let damagePerSecond = 0;
    let currency1 = 14880000;
    let currency2 = 0;
    let currency3 = 0;
    let currency4 = 0;
    let currency5 = 0;
    let maxHP = 100;
    let targetHP = maxHP;
    let knowledgeAboutTarget = false;

    console.log(`Начальные значения: damagePerClick = ${damagePerClick}, damagePerSecond = ${damagePerSecond}, currency1 = ${currency1}, maxHP = ${maxHP}`);

    // Один враг
    let enemy = { name: 'Enemy1', knowledgeDropped: false };
    console.log(`Текущий враг: ${enemy.name}, HP: ${maxHP}`);

    function updateDisplays() {
        console.log('Обновление дисплеев');
        document.getElementById('damagePerClick').textContent = `Урон/Клик: ${damagePerClick}`;
        document.getElementById('damagePerSecond').textContent = `Урон/Сек: ${damagePerSecond}`;
        document.getElementById('currency1').textContent = currency1;
        document.getElementById('currency2').textContent = currency2;
        document.getElementById('currency3').textContent = currency3;
        document.getElementById('currency4').textContent = currency4;
        document.getElementById('currency5').textContent = currency5;
        updateHPDisplay();
    }

    function showNotification(message) {
        console.log(`Показ уведомления: ${message}`);
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
            console.log('Уведомление скрыто');
        }, 2000);
    }

    function updateHPDisplay() {
        console.log('Обновление HP дисплея');
        const hpFill = document.getElementById('hpFill');
        const hpText = document.getElementById('hpText');
        if (knowledgeAboutTarget) {
            const hpPercentage = (targetHP / maxHP) * 100;
            hpFill.style.width = `${hpPercentage}%`;
            hpFill.style.backgroundColor = 'red';
            hpText.textContent = `${targetHP} / ${maxHP}`;
            console.log(`HP: ${targetHP} / ${maxHP}`);
        } else {
            hpFill.style.width = '100%';
            const darknessLevel = 1 - (targetHP / maxHP);
            hpFill.style.backgroundColor = `rgba(255, 0, 0, ${1 - darknessLevel})`;
            hpText.textContent = '?';
            console.log('HP: неизвестно');
        }
    }

    function switchToNextEnemy() {
        console.log('Переход к следующему врагу');
        maxHP = Math.floor(maxHP * 1.08); // Увеличение HP врага на 8%
        targetHP = maxHP;
        knowledgeAboutTarget = false; // Знания о новом враге отсутствуют
        enemy.knowledgeDropped = false; // Сбрасываем состояние знания о враге
        console.log(`Новый HP врага: ${maxHP}`);
        updateDisplays();
    }

    function distributeCurrency() {
        const totalHP = maxHP;
        const currencyAmount = Math.floor(totalHP * 0.32);

        function assignCurrency() {
            const rand = Math.random() * 100;
            console.log(`Случайное число для распределения валюты: ${rand}`);
            if (rand < 50) {
                currency1 += currencyAmount;
                return 'currency1';
            } else if (rand < 70) {
                currency2 += currencyAmount;
                return 'currency2';
            } else if (rand < 80) {
                currency3 += currencyAmount;
                return 'currency3';
            } else if (rand < 82) {
                currency4 += currencyAmount;
                return 'currency4';
            } else if (rand < 82.5) {
                currency5 += currencyAmount;
                return 'currency5';
            }
            return null;
        }

        let currenciesDistributed = [];
        for (let i = 0; i < 5; i++) {
            const currencyType = assignCurrency();
            if (currencyType) {
                currenciesDistributed.push(currencyType);
            }
        }

        showNotification(`Получено: ${currenciesDistributed.join(', ')}`);
        console.log(`Распределенная валюта: ${currenciesDistributed.join(', ')}`);
    }

    document.getElementById('targetImage').addEventListener('click', () => {
        console.log('Изображение цели кликнуто');
        targetHP -= damagePerClick;
        console.log(`Урон нанесен: ${damagePerClick}, оставшееся HP: ${targetHP}`);
        if (targetHP <= 0) {
            targetHP = 0;
            console.log('Цель уничтожена');
            if (!enemy.knowledgeDropped) {
                showNotification('Получены знания!');
                enemy.knowledgeDropped = true; // Знания получены
                knowledgeAboutTarget = true;
                console.log('Знания о враге получены');
            } else {
                showNotification('Враг побежден!');
                console.log('Враг побежден');
            }
            distributeCurrency();
            switchToNextEnemy();
        }
        updateDisplays();
    });

    document.getElementById('profileBtn').addEventListener('click', () => {
        showNotification('Профиль');
        console.log('Кнопка Профиль нажата');
    });

    document.getElementById('upgradeBtn').addEventListener('click', () => {
        baseUpgrades.style.display = 'block';
        overlay.style.display = 'flex';
        console.log('Кнопка Прокачка (База) нажата');
    });

    document.getElementById('questsBtn').addEventListener('click', () => {
        showNotification('Задания');
        console.log('Кнопка Задания нажата');
    });

    document.getElementById('qrBtn').addEventListener('click', () => {
        showNotification('QR');
        console.log('Кнопка QR нажата');
    });

    document.getElementById('marketplaceBtn').addEventListener('click', () => {
        showNotification('Торговая площадь');
        console.log('Кнопка Торговая площадь нажата');
    });

    closeBtn.addEventListener('click', () => {
        baseUpgrades.style.display = 'none';
        overlay.style.display = 'none';
        console.log('Кнопка закрытия попапа нажата');
    });

    document.getElementById('upgradeClickDamage').addEventListener('click', () => {
        if (currency1 >= 50) {
            currency1 -= 50;
            damagePerClick += 1;
            showNotification('Урон за клик улучшен!');
            console.log('Урон за клик улучшен');
            updateDisplays();
        } else {
            showNotification('Недостаточно валюты для прокачки урона за клик');
            console.log('Недостаточно валюты для прокачки урона за клик');
        }
    });

    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency1 >= 100) {
            currency1 -= 100;
            damagePerSecond += 1;
            showNotification('Урон в секунду улучшен!');
            console.log('Урон в секунду улучшен');
            updateDisplays();
        } else {
            showNotification('Недостаточно валюты для прокачки урона в секунду');
            console.log('Недостаточно валюты для прокачки урона в секунду');
        }
    });

    setInterval(() => {
        console.log('Таймер урона в секунду сработал');
        targetHP -= damagePerSecond;
        console.log(`Урон нанесен: ${damagePerSecond}, оставшееся HP: ${targetHP}`);
        if (targetHP <= 0) {
            targetHP = 0;
            console.log('Цель уничтожена');
            if (!enemy.knowledgeDropped) {
                showNotification('Получены знания!');
                enemy.knowledgeDropped = true; // Знания получены
                knowledgeAboutTarget = true;
                console.log('Знания о враге получены');
            } else {
                showNotification('Враг побежден!');
                console.log('Враг побежден');
            }
            distributeCurrency();
            switchToNextEnemy();
        }
        updateDisplays();
    }, 1000);

    updateDisplays();
});
