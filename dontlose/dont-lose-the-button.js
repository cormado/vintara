const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const hiddenButton = document.getElementById('hidden-button');
const rankDisplay = document.getElementById('rank-display');

let score = 0;
let buttonSize = 40;
let isNearButton = false;

const ranks = [
    { name: 'Bronze 1', color: '#5c4033' },
    { name: 'Bronze 2', color: '#5c4033' },
    { name: 'Bronze 3', color: '#5c4033' },
    { name: 'Silver 1', color: '#4a5d6e' },
    { name: 'Silver 2', color: '#4a5d6e' },
    { name: 'Silver 3', color: '#4a5d6e' },
    { name: 'Platinum 1', color: '#3a5f5f' },
    { name: 'Platinum 2', color: '#3a5f5f' },
    { name: 'Platinum 3', color: '#3a5f5f' },
    { name: 'Diamond 1', color: '#2d4a7a' },
    { name: 'Diamond 2', color: '#2d4a7a' },
    { name: 'Diamond 3', color: '#2d4a7a' },
    { name: 'Master 1', color: '#5e2d79' },
    { name: 'Master 2', color: '#5e2d79' },
    { name: 'Master 3', color: '#5e2d79' },
    { name: 'Grand Master 1', color: '#8b1e1e' },
    { name: 'Grand Master 2', color: '#8b1e1e' },
    { name: 'Grand Master 3', color: '#8b1e1e' },
    { name: 'GOD', color: '#D8B910' }
];

startButton.addEventListener('click', startGame);

function startGame() {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    positionButton();
    updateRank();
}

function positionButton() {
    buttonSize = parseInt(hiddenButton.style.width) || 40;
    const maxX = gameContainer.clientWidth - buttonSize;
    const maxY = gameContainer.clientHeight - buttonSize;

    const randomX = Math.max(0, Math.min(maxX, Math.floor(Math.random() * maxX)));
    const randomY = Math.max(0, Math.min(maxY, Math.floor(Math.random() * maxY)));

    hiddenButton.style.width = `${buttonSize}px`;
    hiddenButton.style.height = `${buttonSize}px`;
    hiddenButton.style.left = `${randomX}px`;
    hiddenButton.style.top = `${randomY}px`;
    hiddenButton.style.opacity = '0';
}

function updateRank() {
    const rankIndex = Math.min(Math.floor(score / 2), ranks.length - 1);
    rankDisplay.textContent = ranks[rankIndex].name;
    rankDisplay.style.backgroundColor = ranks[rankIndex].color;
}

gameContainer.addEventListener('mousemove', (e) => {
    const rect = hiddenButton.getBoundingClientRect();
    const buttonX = rect.left + (rect.width / 2);
    const buttonY = rect.top + (rect.height / 2);
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const distance = Math.sqrt((mouseX - buttonX) ** 2 + (mouseY - buttonY) ** 2);

    const proximityThreshold = 40;
    if (distance < proximityThreshold && !isNearButton) {
        isNearButton = true;
        setTimeout(() => {
            if (isNearButton) {
                hiddenButton.style.opacity = '1';
            }
        }, 100);
    } else if (distance >= proximityThreshold && isNearButton) {
        isNearButton = false;
        setTimeout(() => {
            if (!isNearButton) {
                hiddenButton.style.opacity = '0';
            }
        }, 50);
    }
});

// Handle window resize to reposition the button
window.addEventListener('resize', () => {
    if (gameContainer.style.display !== 'none') {
        positionButton();
    }
});

hiddenButton.addEventListener('click', () => {
    score = Math.max(0, score + 1);
    buttonSize = Math.max(10, 40 - Math.floor(score / 2) * 2);
    positionButton();
    updateRank();
});