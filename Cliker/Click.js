document.addEventListener('DOMContentLoaded', () => {
    const buttons = {
        profile: document.getElementById('profile-btn'),
        upgrade: document.getElementById('upgrade-btn'),
        quests: document.getElementById('quests-btn'),
        qrCode: document.getElementById('qr-code-btn'),
        marketplace: document.getElementById('marketplace-btn')
    };

    const modals = {
        profile: document.getElementById('profile-modal'),
        upgrade: document.getElementById('upgrade-modal'),
        quests: document.getElementById('quests-modal'),
        qrCode: document.getElementById('qr-code-modal'),
        marketplace: document.getElementById('marketplace-modal')
    };

    const closeButtons = document.querySelectorAll('.modal .close');

    // Открытие модальных окон
    buttons.profile.addEventListener('click', () => {
        modals.profile.style.display = 'flex';
    });

    buttons.upgrade.addEventListener('click', () => {
        modals.upgrade.style.display = 'flex';
    });

    buttons.quests.addEventListener('click', () => {
        modals.quests.style.display = 'flex';
    });

    buttons.qrCode.addEventListener('click', () => {
        modals.qrCode.style.display = 'flex';
    });

    buttons.marketplace.addEventListener('click', () => {
        modals.marketplace.style.display = 'flex';
    });

    // Закрытие модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.closest('.modal').style.display = 'none';
        });
    });

    // Закрытие модальных окон при клике вне их области
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});
