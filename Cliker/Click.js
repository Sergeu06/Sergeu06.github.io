document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const footerButtons = document.querySelectorAll('.footer-btn');

    footerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            overlay.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
});
