document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.game-btn');
    const overlay = document.getElementById('overlay');
    const newPageContent = document.getElementById('new-page-content');
    const avatarImg = document.getElementById('avatar');

    // Извлекаем UID и URL аватара из текущего URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const avatarUrl = urlParams.get('avatar_url');

    if (!uid) {
        document.body.innerHTML = "<h1>UID not found in URL. Please start the game from Telegram.</h1>";
        return;
    }

    // Устанавливаем URL аватара
    if (avatarUrl) {
        avatarImg.src = avatarUrl;
    } else {
        avatarImg.src = 'default-avatar.png'; // Путь к изображению аватара по умолчанию
    }

    // Добавляем обработчик клика для аватара
    avatarImg.addEventListener('click', () => {
        alert('Profile clicked!');
        // Здесь можно добавить действие при клике на аватар
    });

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
                        url += `&uid=${uid}&avatar_url=${encodeURIComponent(avatarUrl)}`;
                    } else {
                        url += `?uid=${uid}&avatar_url=${encodeURIComponent(avatarUrl)}`;
                    }
                    window.location.href = url;
                }, 1000); // Время для завершения анимации контента
            }, 1000); // Время для завершения анимации кнопки и overlay
        });
    });
});
