document.addEventListener('DOMContentLoaded', () => {
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

    // Враги и их знания
    const enemies = [
        { name: 'Enemy1', hp: 100, knowledgeDropped: false },
        { name: 'Enemy2', hp: 200, knowledgeDropped: false },
        { name: 'Enemy3', hp: 300, knowledgeDropped: false }
    ];
    let currentEnemyIndex = 0;
    let currentEnemy = enemies[currentEnemyIndex];

    function updateDisplays() {
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
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    function updateHPDisplay() {
        const hpFill = document.getElementById('hpFill');
        const hpText = document.getElementById('hpText');
        if (knowledgeAboutTarget) {
            const hpPercentage = (targetHP / maxHP) * 100;
            hpFill.style.width = `${hpPercentage}%`;
            hpFill.style.backgroundColor = 'red';
            hpText.textContent = `${targetHP} / ${maxHP}`;
        } else {
            hpFill.style.width = '100%';
            const darknessLevel = 1 - (targetHP / maxHP);
            hpFill.style.backgroundColor = `rgba(255, 0, 0, ${1 - darknessLevel})`;
            hpText.textContent = '?';
        }
    }

    function switchToNextEnemy() {
        currentEnemyIndex = (currentEnemyIndex + 1) % enemies.length;
        currentEnemy = enemies[currentEnemyIndex];
        maxHP = Math.floor(maxHP * 1.08); // Увеличение HP врага на 8%
        targetHP = maxHP;
        knowledgeAboutTarget = false; // Знания о новом враге отсутствуют
        updateDisplays();
    }

    function distributeCurrency() {
        const totalHP = currentEnemy.hp;
        const currencyAmount = Math.floor(totalHP * 0.32);
        
        // Функция для распределения валюты
        function assignCurrency() {
            const rand = Math.random() * 100;
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
            currenciesDistributed.push(assignCurrency());
        }

        showNotification(`Получено: ${currenciesDistributed.join(', ')}`);
    }

    document.getElementById('targetImage').addEventListener('click', () => {
        targetHP -= damagePerClick;
        if (targetHP <= 0) {
            targetHP = 0;
            if (!currentEnemy.knowledgeDropped) {
                showNotification('Получены знания!');
                currentEnemy.knowledgeDropped = true; // Знания получены
                knowledgeAboutTarget = true;
            } else {
                showNotification('Враг побежден!');
            }
            distributeCurrency();
            switchToNextEnemy();
        }
        updateDisplays();
    });

    document.getElementById('profileBtn').addEventListener('click', () => {
        showNotification('Профиль');
    });

    document.getElementById('upgradeBtn').addEventListener('click', () => {
        baseUpgrades.style.display = 'block';
        overlay.style.display = 'flex';
    });

    document.getElementById('questsBtn').addEventListener('click', () => {
        showNotification('Задания');
    });

    document.getElementById('qrBtn').addEventListener('click', () => {
        showNotification('QR');
    });

    document.getElementById('marketplaceBtn').addEventListener('click', () => {
        showNotification('Торговая площадь');
    });

    closeBtn.addEventListener('click', () => {
        baseUpgrades.style.display = 'none';
        overlay.style.display = 'none';
    });

    document.getElementById('upgradeClickDamage').addEventListener('click', () => {
        if (currency1 >= 50) {
            currency1 -= 50;
            damagePerClick += 1;
            showNotification('Урон за клик улучшен!');
            updateDisplays();
        } else {
            showNotification('Недостаточно валюты для прокачки урона за клик');
        }
    });

    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency1 >= 100) {
            currency1 -= 100;
            damagePerSecond += 1;
            showNotification('Урон в секунду улучшен!');
            updateDisplays();
        } else {
            showNotification('Недостаточно валюты для прокачки урона в секунду');
        }
    });

    setInterval(() => {
        targetHP -= damagePerSecond;
        if (targetHP <= 0) {
            targetHP = 0;
            if (!currentEnemy.knowledgeDropped) {
                showNotification('Получены знания!');
                currentEnemy.knowledgeDropped = true; // Знания получены
                knowledgeAboutTarget = true;
            } else {
                showNotification('Враг побежден!');
            }
            distributeCurrency();
            switchToNextEnemy();
        }
        updateDisplays();
    }, 1000);

    updateDisplays();
});
