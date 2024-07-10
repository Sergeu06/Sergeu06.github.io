document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.game-btn');
    const overlay = document.getElementById('overlay');
    const newPageContent = document.getElementById('new-page-content');

    // Извлекаем UID из текущего URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');

    if (!uid) {
        document.body.innerHTML = "<h1>UID not found in URL. Please start the game from Telegram.</h1>";
        return;
    }

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const rect = button.getBoundingClientRect();
            const buttonStyle = getComputedStyle(button);
            const bgColor = buttonStyle.backgroundColor;

            button.style.setProperty('--btn-top', `${rect.top}px`);
            button.style.setProperty('--btn-left', `${rect.left}px`);
            button.style.setProperty('--btn-width', `${rect.width}px`);
            button.style.setProperty('--btn-height', `${rect.height}px`);
            button.style.setProperty('--btn-bg-color', bgColor);

            button.classList.add('active');
            overlay.classList.add('show');

            setTimeout(() => {
                newPageContent.classList.add('show');
                setTimeout(() => {
                    let url = button.getAttribute('data-url');
                    if (url.includes('?')) {
                        url += `&uid=${uid}`;
                    } else {
                        url += `?uid=${uid}`;
                    }
                    window.location.href = url;
                }, 1000); // Время для завершения анимации контента
            }, 1000); // Время для завершения анимации кнопки и overlay
        });
    });
});
