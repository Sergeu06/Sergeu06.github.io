document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const notification = document.getElementById('notification');
    const baseUpgrades = document.getElementById('baseUpgrades');

    let damagePerClick = 1;
    let damagePerSecond = 0;
    let currency1 = 0;
    let currency2 = 0;
    let currency3 = 0;
    let currency4 = 0;
    let currency5 = 0;
    let maxHP = 100;
    let targetHP = maxHP;
    let knowledgeAboutTarget = false;
    let enemyLevel = 1;
    const enemyName = 'Enemy1'; // Имя врага
    
    const enemiesKnowledge = {
        'Enemy1': false
    };

    function updateDisplays() {
        document.getElementById('damagePerClick').textContent = `Урон/Клик: ${damagePerClick}`;
        document.getElementById('damagePerSecond').textContent = `Урон/Сек: ${damagePerSecond}`;
        document.getElementById('currency1').textContent = currency1;
        document.getElementById('currency2').textContent = currency2;
        document.getElementById('currency3').textContent = currency3;
        document.getElementById('currency4').textContent = currency4;
        document.getElementById('currency5').textContent = currency5;
        document.getElementById('enemyName').textContent = `Враг: ${enemyName}`;
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
        maxHP = Math.floor(maxHP * 1.08); // Увеличиваем HP врага на 8%
        targetHP = maxHP;
        enemyLevel++; // Увеличиваем уровень врага
        knowledgeAboutTarget = enemiesKnowledge[enemyName]; // Знания о новом враге
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
        if (knowledgeChance < 0.25 && !enemiesKnowledge[enemyName]) {
            showNotification('Получены знания!');
            enemiesKnowledge[enemyName] = true; // Знания получены
            knowledgeAboutTarget = true;
            updateHPDisplay();
        }
    }

    document.getElementById('targetImage').addEventListener('click', () => {
        targetHP -= damagePerClick;
        if (targetHP <= 0) {
            targetHP = 0;
            checkKnowledgeDrop();
            if (knowledgeAboutTarget) {
                showNotification('Враг побежден!');
                distributeCurrency();
                switchToNextEnemy();
            }
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
            checkKnowledgeDrop();
            if (knowledgeAboutTarget) {
                showNotification('Враг побежден!');
                distributeCurrency();
                switchToNextEnemy();
            }
        }
        updateDisplays();
    }, 1000);

    updateDisplays();
});
