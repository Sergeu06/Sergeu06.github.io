document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const notification = document.getElementById('notification');
    const knowledgeNotification = document.getElementById('knowledgeNotification');
    const baseUpgrades = document.getElementById('baseUpgrades');
    const nextEnemyBtn = document.getElementById('nextEnemyBtn');
    const targetImage = document.getElementById('targetImage');
    const targetContainer = document.querySelector('.target-container');
    const upgradeBtn = document.getElementById('upgradeBtn');

    let damagePerClick = 81;
    let damagePerSecond = 10;
    let currency1 = 0;
    let currency2 = 0;
    let currency3 = 0;
    let currency4 = 0;
    let currency5 = 0;
    let maxHP = 100;
    let targetHP = maxHP;
    let knowledgeAboutTarget = false;
    let enemyLevel = 1;
    let enemyIndex = 0;
    const enemies = ['Enemy1', 'Enemy2'];
    const enemyNames = ['Enemy1', 'Enemy2'];

    const enemiesKnowledge = {
        'Enemy1': false,
        'Enemy2': false
    };

    function updateDisplays() {
        document.getElementById('damagePerClick').textContent = `Урон/Клик: ${damagePerClick}`;
        document.getElementById('damagePerSecond').textContent = `Урон/Сек: ${damagePerSecond}`;
        document.getElementById('currency1').textContent = currency1;
        document.getElementById('currency2').textContent = currency2;
        document.getElementById('currency3').textContent = currency3;
        document.getElementById('currency4').textContent = currency4;
        document.getElementById('currency5').textContent = currency5;
        document.getElementById('enemyName').textContent = `Враг: ${enemies[enemyIndex]}`;
        document.getElementById('enemyLevel').textContent = `Уровень: ${enemyLevel}`;
        updateHPDisplay();
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    function showKnowledgeNotification(message) {
        knowledgeNotification.textContent = message;
        knowledgeNotification.style.display = 'block';
        setTimeout(() => {
            knowledgeNotification.style.display = 'none';
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
        console.log('HP отображение обновлено:', knowledgeAboutTarget, targetHP, maxHP); // Лог HP
    }

    function switchToNextEnemy() {
        maxHP = Math.floor(maxHP * 1.08); // Увеличиваем HP врага на 8%
        targetHP = maxHP;
        enemyLevel++; // Увеличиваем уровень врага
        knowledgeAboutTarget = enemiesKnowledge[enemies[enemyIndex]]; // Знания о новом враге
        updateDisplays();
    }

    function distributeCurrency() {
        const totalHP = maxHP;
        const totalCurrency = Math.floor(totalHP * 0.32);

        for (let i = 0; i < totalCurrency; i++) {
            const rand = Math.random() * 100;
            if (rand < 50) {
                currency1++;
            } else if (rand < 50 + 30) {
                currency2++;
            } else if (rand < 50 + 30 + 15) {
                currency3++;
            } else if (rand < 50 + 30 + 15 + 4.5) {
                currency4++;
            } else if (rand < 50 + 30 + 15 + 4.5 + 0.5) {
                currency5++;
            }
        }

        showNotification(`Получено валюты:
            1 типа: ${currency1}, 
            2 типа: ${currency2}, 
            3 типа: ${currency3}, 
            4 типа: ${currency4}, 
            5 типа: ${currency5}`);
    }

    function checkKnowledgeDrop() {
        const knowledgeChance = Math.random();
        console.log('Знания проверены:', enemiesKnowledge[enemies[enemyIndex]], knowledgeChance); // Лог знаний
        if (knowledgeChance < 0.20 && !enemiesKnowledge[enemies[enemyIndex]]) {
            showKnowledgeNotification('Получены знания!');
            enemiesKnowledge[enemies[enemyIndex]] = true; // Знания получены
            knowledgeAboutTarget = true;
            updateHPDisplay();
        }
    }

    document.getElementById('targetImage').addEventListener('click', () => {
        targetHP -= damagePerClick;
        if (targetHP <= 0) {
            targetHP = 0;
            checkKnowledgeDrop();
            showNotification('Враг побежден!');
            distributeCurrency();
            switchToNextEnemy();
        }
        updateDisplays();
    });

    nextEnemyBtn.addEventListener('click', () => {
        enemyIndex = (enemyIndex + 1) % enemies.length;
        enemyLevel = 1;
        maxHP = 100;
        targetHP = maxHP;
        knowledgeAboutTarget = enemiesKnowledge[enemies[enemyIndex]];
        targetContainer.style.transform = `translateX(-${enemyIndex * 100}%)`; // Двигаем картинку врага
        updateDisplays();
    });

    upgradeBtn.addEventListener('click', () => {
        overlay.style.display = 'block';
        baseUpgrades.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        baseUpgrades.style.display = 'none';
    });

    document.getElementById('upgradeClickDamage').addEventListener('click', () => {
        if (currency1 >= 50) {
            currency1 -= 50;
            damagePerClick++;
            updateDisplays();
        } else {
            showNotification('Недостаточно валюты!');
        }
    });

    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency2 >= 100) {
            currency2 -= 100;
            damagePerSecond++;
            updateDisplays();
        } else {
            showNotification('Недостаточно валюты!');
        }
    });

    setInterval(() => {
        if (damagePerSecond > 0 && targetHP > 0) {
            targetHP -= damagePerSecond;
            if (targetHP <= 0) {
                targetHP = 0;
                checkKnowledgeDrop();
                showNotification('Враг побежден!');
                distributeCurrency();
                switchToNextEnemy();
            }
            updateDisplays();
        }
    }, 1000);

    updateDisplays();
});
