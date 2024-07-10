document.addEventListener('DOMContentLoaded', () => {
    let targetHP = 100;
    let damagePerClick = 1;
    let passiveDamage = 0;

    const targetElement = document.getElementById('target');
    const targetHpElement = document.getElementById('target-hp-value');
    const damagePerClickElement = document.getElementById('damage-per-click');
    const passiveDamageElement = document.getElementById('passive-damage');

    // Update target HP display
    const updateTargetHP = () => {
        targetHpElement.textContent = targetHP;
        if (targetHP <= 0) {
            // Handle target defeated
            targetHP = 100; // Reset target HP for now
            alert('Цель побеждена!');
        }
    };

    // Handle clicking on the target
    targetElement.addEventListener('click', () => {
        targetHP -= damagePerClick;
        updateTargetHP();
    });

    // Passive damage over time
    setInterval(() => {
        if (targetHP > 0) {
            targetHP -= passiveDamage;
            updateTargetHP();
        }
    }, 1000);

    // Initial update of the target HP
    updateTargetHP();

    // Modal functionality
    const modals = {
        profile: document.getElementById('modal-profile'),
        upgrade: document.getElementById('modal-upgrade'),
        quests: document.getElementById('modal-quests'),
        qrCode: document.getElementById('modal-qr-code'),
        marketplace: document.getElementById('modal-marketplace')
    };

    const buttons = {
        profile: document.getElementById('profile'),
        upgrade: document.getElementById('upgrade'),
        quests: document.getElementById('quests'),
        qrCode: document.getElementById('qr-code'),
        marketplace: document.getElementById('marketplace')
    };

    const closeButtons = {
        profile: document.getElementById('close-profile'),
        upgrade: document.getElementById('close-upgrade'),
        quests: document.getElementById('close-quests'),
        qrCode: document.getElementById('close-qr-code'),
        marketplace: document.getElementById('close-marketplace')
    };

    buttons.profile.addEventListener('click', () => { modals.profile.style.display = 'flex'; });
    buttons.upgrade.addEventListener('click', () => { modals.upgrade.style.display = 'flex'; });
    buttons.quests.addEventListener('click', () => { modals.quests.style.display = 'flex'; });
    buttons.qrCode.addEventListener('click', () => { modals.qrCode.style.display = 'flex'; });
    buttons.marketplace.addEventListener('click', () => { modals.marketplace.style.display = 'flex'; });

    closeButtons.profile.addEventListener('click', () => { modals.profile.style.display = 'none'; });
    closeButtons.upgrade.addEventListener('click', () => { modals.upgrade.style.display = 'none'; });
    closeButtons.quests.addEventListener('click', () => { modals.quests.style.display = 'none'; });
    closeButtons.qrCode.addEventListener('click', () => { modals.qrCode.style.display = 'none'; });
    closeButtons.marketplace.addEventListener('click', () => { modals.marketplace.style.display = 'none'; });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});
