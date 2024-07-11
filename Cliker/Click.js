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
        }
    });
    
    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency >= 100) { // Пример стоимости прокачки
            currency -= 100;
            damagePerSecond += 1;
            updateDisplays();
        }
    });
    
    targetImage.addEventListener('click', () => {
        dealDamage(damagePerClick);
    });
    
    function dealDamage(damage) {
        targetHP -= damage;
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
    }
    
    function targetDefeated() {
        console.log('Target defeated!');
        // Шанс получить знание о противнике
        if (Math.random() < 0.25) {
            knowledgeAboutTarget = true;
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
});
