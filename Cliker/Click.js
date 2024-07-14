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
    let targetHP = 100;
    const maxHP = 100;

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
        const hpFill = document.getElementById('hpFill');
        hpFill.style.width = `${(targetHP / maxHP) * 100}%`;
        document.getElementById('hpText').textContent = `${targetHP} / ${maxHP}`;
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    function switchToNextEnemy() {
        currentEnemyIndex = (currentEnemyIndex + 1) % enemies.length;
        currentEnemy = enemies[currentEnemyIndex];
        targetHP = currentEnemy.hp;
        currentEnemy.knowledgeDropped = false; // Сбросить знания для нового врага
        updateDisplays();
    }

    document.getElementById('targetImage').addEventListener('click', () => {
        targetHP -= damagePerClick;
        if (targetHP <= 0) {
            if (!currentEnemy.knowledgeDropped) {
                currency1 += 1;
                showNotification('Target defeated! +1 currency1 and knowledge acquired');
                currentEnemy.knowledgeDropped = true; // Знания получены
            } else {
                showNotification('Target defeated! +1 currency1');
            }
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
            showNotification('Недостаточно валюты');
        }
    });

    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency1 >= 100) {
            currency1 -= 100;
            damagePerSecond += 1;
            showNotification('Урон в секунду улучшен!');
            updateDisplays();
        } else {
            showNotification('Недостаточно валюты');
        }
    });

    setInterval(() => {
        targetHP -= damagePerSecond;
        if (targetHP <= 0) {
            if (!currentEnemy.knowledgeDropped) {
                currency1 += 1;
                showNotification('Target defeated! +1 currency1 and knowledge acquired');
                currentEnemy.knowledgeDropped = true; // Знания получены
            } else {
                showNotification('Target defeated! +1 currency1');
            }
            switchToNextEnemy();
        }
        updateDisplays();
    }, 1000);

    updateDisplays();
});
