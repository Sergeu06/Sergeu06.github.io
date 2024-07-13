document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const notification = document.getElementById('notification');
    const baseUpgrades = document.getElementById('baseUpgrades');
    
    let damagePerClick = 1;
    let damagePerSecond = 0;
    let currency1 = 10000;
    let currency2 = 0;
    let currency3 = 0;
    let currency4 = 0;
    let currency5 = 0;
    let targetHP = 100;
    let maxHP = 100;
    let knowledgeAboutTarget = false;
    
    const currencyDisplay1 = document.getElementById('currency1');
    const currencyDisplay2 = document.getElementById('currency2');
    const currencyDisplay3 = document.getElementById('currency3');
    const currencyDisplay4 = document.getElementById('currency4');
    const currencyDisplay5 = document.getElementById('currency5');
    const dpcDisplay = document.getElementById('damagePerClick');
    const dpsDisplay = document.getElementById('damagePerSecond');
    const targetImage = document.getElementById('targetImage');
    const hpFill = document.getElementById('hpFill');
    const hpText = document.getElementById('hpText');
    
    currencyDisplay1.textContent = currency1;
    currencyDisplay2.textContent = currency2;
    currencyDisplay3.textContent = currency3;
    currencyDisplay4.textContent = currency4;
    currencyDisplay5.textContent = currency5;
    
    document.getElementById('upgradeClickDamage').addEventListener('click', () => {
        if (currency1 >= 50) { // Пример стоимости прокачки
            currency1 -= 50;
            damagePerClick += 1;
            updateDisplays();
            console.log(`Урон за клик увеличен до ${damagePerClick}`);
        } else {
            console.log("Недостаточно валюты для прокачки урона за клик");
        }
    });
    
    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency1 >= 100) { // Пример стоимости прокачки
            currency1 -= 100;
            damagePerSecond += 1;
            updateDisplays();
            console.log(`Урон в секунду увеличен до ${damagePerSecond}`);
        } else {
            console.log("Недостаточно валюты для прокачки урона в секунду");
        }
    });
    
    targetImage.addEventListener('click', () => {
        dealDamage(damagePerClick);
    });
    
    function dealDamage(damage) {
        targetHP -= damage;
        console.log(`Нанесен урон: ${damage}. Осталось HP: ${targetHP}`);
        if (targetHP <= 0) {
            targetHP = 0;
            targetDefeated();
        }
        updateHPDisplay();
    }
    
    function updateHPDisplay() {
        if (knowledgeAboutTarget) {
            const hpPercentage = (targetHP / maxHP) * 100;
            hpFill.style.width = `${hpPercentage}%`;
            hpFill.style.backgroundColor = 'red'; // Полоска всегда красная при знании о противнике
            hpText.textContent = `${targetHP} / ${maxHP}`;
        } else {
            hpFill.style.width = '100%';
            const darknessLevel = 1 - (targetHP / maxHP);
            hpFill.style.backgroundColor = `rgba(255, 0, 0, ${1 - darknessLevel})`; // Полоска изначально красная и постепенно чернеет
            hpText.textContent = '?';
        }
        console.log(`HP Display Updated. Current HP: ${targetHP}. Knowledge: ${knowledgeAboutTarget}`);
    }
    
    function targetDefeated() {
        console.log('Противник побежден!');
        // Шанс получить знание о противнике
        if (Math.random() < 0.25) {
            knowledgeAboutTarget = true;
            console.log('Получены знания о противнике.');
            showNotification('Вы получили знания о противнике!');
        } else {
            console.log('Знания о противнике не получены.');
        }
        // Возвращаем HP противника
        maxHP += 100;
        targetHP = maxHP;
        updateHPDisplay();
    }
    
    function updateDisplays() {
        currencyDisplay1.textContent = currency1;
        currencyDisplay2.textContent = currency2;
        currencyDisplay3.textContent = currency3;
        currencyDisplay4.textContent = currency4;
        currencyDisplay5.textContent = currency5;
        dpcDisplay.textContent = damagePerClick;
        dpsDisplay.textContent = damagePerSecond;
        console.log(`Обновлены показатели: Валюта: ${currency1}, Урон/Клик: ${damagePerClick}, Урон/Сек: ${damagePerSecond}`);
    }
    
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000); // Уведомление исчезает через 3 секунды
    }
    
    setInterval(() => {
        dealDamage(damagePerSecond);
    }, 1000);
    
    document.getElementById('profileBtn').addEventListener('click', () => {
        overlay.style.display = 'flex';
        baseUpgrades.style.display = 'none';
    });

    document.getElementById('upgradeBtn').addEventListener('click', () => {
        overlay.style.display = 'flex';
        baseUpgrades.style.display = 'block';
    });

    document.getElementById('questsBtn').addEventListener('click', () => {
        overlay.style.display = 'flex';
        baseUpgrades.style.display = 'none';
    });

    document.getElementById('qrBtn').addEventListener('click', () => {
        overlay.style.display = 'flex';
        baseUpgrades.style.display = 'none';
    });

    document.getElementById('marketplaceBtn').addEventListener('click', () => {
        overlay.style.display = 'flex';
        baseUpgrades.style.display = 'none';
    });
    
    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
    
    // Инициализация начального отображения
    hpFill.style.backgroundColor = 'red'; // Изначально полоска красная
    updateHPDisplay();
    updateDisplays();
});
