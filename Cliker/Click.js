document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const footerButtons = document.querySelectorAll('.footer-btn');
    
    let damagePerClick = 1;
    let damagePerSecond = 0;
    let currency = 1000; // Пример стартовой валюты
    let targetHP = 100;
    let maxHP = 100;
    let knowledgeAboutTarget = false;
    
    const currencyDisplay = document.getElementById('currency1');
    const dpcDisplay = document.getElementById('damagePerClick');
    const dpsDisplay = document.getElementById('damagePerSecond');
    const targetImage = document.getElementById('targetImage');
    const hpFill = document.getElementById('hpFill');
    const hpText = document.getElementById('hpText');
    
    currencyDisplay.textContent = currency;
    
    document.getElementById('upgradeClickDamage').addEventListener('click', () => {
        if (currency >= 50) { // Пример стоимости прокачки
            currency -= 50;
            damagePerClick += 1;
            updateDisplays();
            console.log(`Урон за клик увеличен до ${damagePerClick}`);
        } else {
            console.log("Недостаточно валюты для прокачки урона за клик");
        }
    });
    
    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency >= 100) { // Пример стоимости прокачки
            currency -= 100;
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
            hpText.textContent = `${targetHP} / ${maxHP}`;
        } else {
            const hpPercentage = Math.max(0, 100 - ((maxHP - targetHP) / maxHP) * 100);
            hpFill.style.width = `${hpPercentage}%`;
            hpFill.style.backgroundColor = `rgba(0, 0, 0, ${1 - hpPercentage / 100})`;
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
        } else {
            console.log('Знания о противнике не получены.');
        }
        // Возвращаем HP противника
        maxHP += 100;
        targetHP = maxHP;
        updateHPDisplay();
    }
    
    function updateDisplays() {
        currencyDisplay.textContent = currency;
        dpcDisplay.textContent = damagePerClick;
        dpsDisplay.textContent = damagePerSecond;
        console.log(`Обновлены показатели: Валюта: ${currency}, Урон/Клик: ${damagePerClick}, Урон/Сек: ${damagePerSecond}`);
    }
    
    setInterval(() => {
        dealDamage(damagePerSecond);
    }, 1000);
    
    footerButtons.forEach(button => {
        button.addEventListener('click', () => {
            overlay.style.display = 'flex';
        });
    });
    
    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
    
    // Инициализация начального отображения
    updateHPDisplay();
    updateDisplays();
});
