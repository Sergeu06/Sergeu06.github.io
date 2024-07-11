document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const footerButtons = document.querySelectorAll('.footer-btn');

    let damagePerClick = 1;
    let damagePerSecond = 0;
    let currency = 1000; // Пример стартовой валюты

    const currencyDisplay = document.getElementById('currency1');
    const dpcDisplay = document.getElementById('damagePerClick');
    const dpsDisplay = document.getElementById('damagePerSecond');
    const targetImage = document.getElementById('targetImage');

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
        // Логика нанесения урона по клику
        console.log(`Нанесено урона: ${damagePerClick}`);
    });

    footerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            overlay.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    function updateDisplays() {
        currencyDisplay.textContent = currency;
        dpcDisplay.textContent = damagePerClick;
        dpsDisplay.textContent = damagePerSecond;
    }

    // Механика урона в секунду
    setInterval(() => {
        console.log(`Урон в секунду: ${damagePerSecond}`);
        // Здесь можно добавить логику уменьшения HP цели
    }, 1000);
});
