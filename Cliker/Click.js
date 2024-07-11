document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const footerButtons = document.querySelectorAll('.footer-btn');
    const notification = document.getElementById('notification');

    let damagePerClick = 1;
    let damagePerSecond = 0;
    let currency = 1000; // Пример стартовой валюты
    let targetHP = 100;
    let maxHP = 100;
    let knowledgeAboutTarget = false;
    let originalColor = 'red';

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

    function updateHPDisplay() {
        if (knowledgeAboutTarget) {
            hpText.innerText = `${targetHP} / ${maxHP}`;
            hpFill.style.width = `${(targetHP / maxHP) * 100}%`;
            hpFill.style.backgroundColor = originalColor;
        } else {
            hpText.innerText = '?';
            hpFill.style.backgroundColor = `rgb(${Math.max(0, 255 - (255 * (1 - targetHP / maxHP)))}, 0, 0)`;
        }
    }

    function updateDisplays() {
        currencyDisplay1.innerText = currency;
        currencyDisplay2.innerText = currency;
        currencyDisplay3.innerText = currency;
        currencyDisplay4.innerText = currency;
        currencyDisplay5.innerText = currency;
        dpcDisplay.innerText = damagePerClick;
        dpsDisplay.innerText = damagePerSecond;
    }

    function showNotification(message) {
        notification.innerText = message;
        notification.classList.remove('hidden');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 4000);
    }

    function dealDamage(amount) {
        if (targetHP > 0) {
            targetHP -= amount;
            if (targetHP <= 0) {
                targetHP = 0;
                if (!knowledgeAboutTarget) {
                    knowledgeAboutTarget = Math.random() < 0.25; // 25% шанс получения знаний
                    if (knowledgeAboutTarget) {
                        showNotification('Получены знания о противнике!');
                    }
                }
                setTimeout(() => {
                    targetHP = maxHP;
                    updateHPDisplay();
                }, 1000);
            }
        }
        updateHPDisplay();
    }

    document.getElementById('targetImage').addEventListener('click', () => {
        dealDamage(damagePerClick);
        console.log(`Нанесено урона за клик: ${damagePerClick}, осталось HP: ${targetHP}`);
    });

    document.getElementById('upgradeClickDamage').addEventListener('click', () => {
        if (currency >= 50) { // Пример стоимости улучшения
            currency -= 50;
            damagePerClick += 1;
            updateDisplays();
            console.log(`Улучшен урон за клик до: ${damagePerClick}`);
        }
    });

    document.getElementById('upgradeDPS').addEventListener('click', () => {
        if (currency >= 100) { // Пример стоимости улучшения
            currency -= 100;
            damagePerSecond += 1;
            updateDisplays();
            console.log(`Улучшен урон в секунду до: ${damagePerSecond}`);
        }
    });

    setInterval(() => {
        if (damagePerSecond > 0) {
            dealDamage(damagePerSecond);
            console.log(`Нанесено урона в секунду: ${damagePerSecond}, осталось HP: ${targetHP}`);
        }
    }, 1000);

    footerButtons.forEach(button => {
        button.addEventListener('click', () => {
            overlay.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    hpFill.style.backgroundColor = 'red'; // Изначально полоска красная
    updateHPDisplay();
    updateDisplays();
});
