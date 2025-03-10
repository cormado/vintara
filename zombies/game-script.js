const gameArea = document.getElementById('game-area');
const startScreen = document.getElementById('start-screen');
const playButton = document.getElementById('play-button');
const music = document.getElementById('background-music');
const moneyDisplay = document.getElementById('money');
const roundDisplay = document.getElementById('round');
const zombieCountDisplay = document.getElementById('zombie-count');
const zombieGoalDisplay = document.getElementById('zombie-goal');
const gameOver = document.getElementById('game-over');
const playerHealthBar = document.getElementById('player-health-bar');
const damageButton = document.getElementById('damage-button');
const moneyButton = document.getElementById('money-button');
const healthButton = document.getElementById('health-button');

let money = 0;
let round = 1;
let zombiesKilled = 0;
let zombiesSpawned = 0;
let zombieGoal = 2;
let damage = 1;
let extraMoney = 0;
let baseSpawnRate = 1000;
let gameActive = false;
let maxHealth = 200;
let playerHealth = maxHealth;
let ultraModeActive = false;
let casinoActive = false;
let immortalActive = false;

let damageLevel = 0;
const damagePrices = [500, 700, 900, 1000, 2000];
let moneyLevel = 0;
const moneyPrices = [200, 500, 800, 1000];
let healthLevel = 0;
const healthPrices = [800, 1300, 1600, 2000, 4000];

let activePowerUps = [];

playButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    music.play();
    gameActive = true;
    spawnZombies();
    updateHealthBar();
    startHealthDrain();
    spawnPowerUps();
});

function spawnZombies() {
    if (!gameActive || zombiesSpawned >= zombieGoal) return;

    const shopRect = document.getElementById('shop').getBoundingClientRect();
    const zombie = document.createElement('div');
    const isBossRound = round % 10 === 0;
    const isBoss = isBossRound && zombiesSpawned === 0;
    zombie.className = isBoss ? 'zombie boss' : 'zombie';

    let x, y;
    do {
        x = Math.random() * (window.innerWidth - (isBoss ? 160 : 80));
        y = Math.random() * (window.innerHeight - (isBoss ? 160 : 80));
    } while (x + (isBoss ? 160 : 80) > shopRect.left && x < shopRect.right && 
             y + (isBoss ? 160 : 80) > shopRect.top && y < shopRect.bottom);

    zombie.style.left = x + 'px';
    zombie.style.top = y + 'px';

    let baseHealth = 3 + round;
    let zombieDamage = 0.5 + (round * 0.1);
    let health = isBoss ? baseHealth * 3 : baseHealth;
    zombieDamage = isBoss ? zombieDamage * 3 : zombieDamage;
    const maxHealthZombie = health;

    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';
    zombie.appendChild(healthBar);
    healthBar.style.display = 'none';

    zombie.addEventListener('click', () => {
        health -= ultraModeActive ? maxHealthZombie : damage;
        healthBar.style.display = 'block';
        healthBar.style.width = `${(health / maxHealthZombie) * (isBoss ? 90 : 80)}%`;

        if (health <= 0) {
            const moneyEarned = (10 + (round * 2) + (isBoss ? 50 : extraMoney)) * (casinoActive ? 2 : 1);
            money += moneyEarned;
            moneyDisplay.textContent = money;
            gameArea.removeChild(zombie);
            zombiesKilled++;
            zombieCountDisplay.textContent = zombiesKilled;

            if (zombiesKilled >= zombieGoal) {
                nextRound();
            }
        }
    });

    gameArea.appendChild(zombie);
    zombiesSpawned++;
    zombieCountDisplay.textContent = zombiesKilled;

    const spawnRate = Math.max(200, baseSpawnRate - (round * 50));
    if (zombiesSpawned < zombieGoal) {
        setTimeout(spawnZombies, spawnRate);
    }
}

function nextRound() {
    round++;
    roundDisplay.textContent = round;
    zombiesKilled = 0;
    zombiesSpawned = 0;
    zombieGoal = round * 2;
    zombieGoalDisplay.textContent = zombieGoal;
    zombieCountDisplay.textContent = zombiesKilled;
    spawnZombies();
}

function spawnPowerUps() {
    if (!gameActive) return;

    const powerUps = [
        { name: 'Ultra Mode', image: 'ultram.png', effect: activateUltraMode },
        { name: 'Casino', image: 'casino.png', effect: activateCasino },
        { name: 'Skull', image: 'skull.png', effect: activateSkull },
        { name: 'Inmortal', image: 'inmortal.png', effect: activateInmortal }
    ];

    setInterval(() => {
        if (Math.random() < 0.1) {
            const powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
            const powerUpElement = document.createElement('div');
            powerUpElement.className = 'power-up';
            powerUpElement.style.background = `url('${powerUp.image}') no-repeat center`;
            powerUpElement.style.backgroundSize = 'contain';

            const shopRect = document.getElementById('shop').getBoundingClientRect();
            let x, y;
            do {
                x = Math.random() * (window.innerWidth - 75);
                y = Math.random() * (window.innerHeight - 75);
            } while (x + 75 > shopRect.left && x < shopRect.right && 
                    y + 75 > shopRect.top && y < shopRect.bottom);

            powerUpElement.style.left = x + 'px';
            powerUpElement.style.top = y + 'px';

            powerUpElement.addEventListener('click', () => {
                const audio = new Audio(`${powerUp.image.replace('.png', '.mp3')}`);
                audio.play();
                powerUp.effect();
                gameArea.removeChild(powerUpElement);
            });

            gameArea.appendChild(powerUpElement);
            setTimeout(() => {
                if (powerUpElement.parentNode) gameArea.removeChild(powerUpElement);
            }, 10000);
        }
    }, 5000);
}

function activateUltraMode() {
    ultraModeActive = true;
    showPowerUpTimer('Ultra Mode', 20);
    setTimeout(() => ultraModeActive = false, 20000);
}

function activateCasino() {
    casinoActive = true;
    showPowerUpTimer('Casino', 20);
    setTimeout(() => casinoActive = false, 20000);
}

function activateSkull() {
    const zombies = document.getElementsByClassName('zombie');
    while (zombies.length > 0) {
        const zombie = zombies[0];
        money += (10 + (round * 2) + (zombie.classList.contains('boss') ? 50 : extraMoney));
        gameArea.removeChild(zombie);
        zombiesKilled++;
    }
    moneyDisplay.textContent = money;
    zombieCountDisplay.textContent = zombiesKilled;
    if (zombiesKilled >= zombieGoal) nextRound();
}

function activateInmortal() {
    immortalActive = true;
    playerHealth = maxHealth;
    playerHealthBar.style.background = 'linear-gradient(90deg, #3333ff, #6666ff)';
    updateHealthBar();
    showPowerUpTimer('Inmortal', 20);
    setTimeout(() => {
        immortalActive = false;
        playerHealthBar.style.background = 'linear-gradient(90deg, #33ff33, #66ff66)';
    }, 20000);
}

function showPowerUpTimer(name, duration) {
    const powerUpDisplay = document.createElement('div');
    powerUpDisplay.className = 'power-up-display';
    let timeLeft = duration;
    powerUpDisplay.textContent = `${name}: ${timeLeft}s`;
    gameArea.appendChild(powerUpDisplay);

    const height = 40;
    powerUpDisplay.style.bottom = `${10 + (activePowerUps.length * height)}px`;

    activePowerUps.push({ element: powerUpDisplay, name: name });

    const timer = setInterval(() => {
        timeLeft--;
        powerUpDisplay.textContent = `${name}: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameArea.removeChild(powerUpDisplay);
            const index = activePowerUps.findIndex(p => p.element === powerUpDisplay);
            if (index !== -1) activePowerUps.splice(index, 1);
            updatePowerUpPositions();
        }
    }, 1000);

    if (name === 'Skull') {
        clearInterval(timer);
        gameArea.removeChild(powerUpDisplay);
        activePowerUps.pop();
    }
}

function updatePowerUpPositions() {
    const height = 40;
    activePowerUps.forEach((powerUp, index) => {
        powerUp.element.style.bottom = `${10 + (index * height)}px`;
    });
}

function buyDamage() {
    if (damageLevel < 5 && money >= damagePrices[damageLevel]) {
        money -= damagePrices[damageLevel];
        damageLevel++;
        damage++;
        moneyDisplay.textContent = money;
        updateShopButtons();
    }
}

function buyExtraMoney() {
    if (moneyLevel < 4 && money >= moneyPrices[moneyLevel]) {
        money -= moneyPrices[moneyLevel];
        moneyLevel++;
        extraMoney += 5;
        moneyDisplay.textContent = money;
        updateShopButtons();
    }
}

function buyMedkit() {
    if (money >= 100) {
        money -= 100;
        playerHealth = Math.min(maxHealth, playerHealth + 50); // Cap at maxHealth
        moneyDisplay.textContent = money;
        updateHealthBar();
    }
}

function buyHealthBoost() {
    if (healthLevel < 5 && money >= healthPrices[healthLevel]) {
        money -= healthPrices[healthLevel];
        healthLevel++;
        const healthIncrease = 50;
        maxHealth += healthIncrease;
        playerHealth = Math.min(maxHealth, playerHealth + healthIncrease); // Ensure health doesn't exceed max
        moneyDisplay.textContent = money;
        updateHealthBar();
        updateShopButtons();
    }
}

function updateShopButtons() {
    damageButton.textContent = damageLevel < 5 ? 
        `More Damage: Level ${damageLevel + 1} ($${damagePrices[damageLevel]})` : 
        "More Damage: MAX";
    moneyButton.textContent = moneyLevel < 4 ? 
        `Extra Money: Level ${moneyLevel + 1} ($${moneyPrices[moneyLevel]})` : 
        "Extra Money: MAX";
    healthButton.textContent = healthLevel < 5 ? 
        `Health Boost: Level ${healthLevel + 1} ($${healthPrices[healthLevel]})` : 
        "Health Boost: MAX";
}

function updateHealthBar() {
    const healthPercentage = Math.max(0, Math.min(1, playerHealth / maxHealth)); // Ensure 0 to 1 range
    playerHealthBar.style.width = `${healthPercentage * 20}vw`; // Use vw for responsiveness
    if (playerHealth <= 0 && !immortalActive) {
        endGame();
    }
}

function startHealthDrain() {
    setInterval(() => {
        if (gameActive && !immortalActive) {
            const zombies = document.getElementsByClassName('zombie');
            let totalDamage = 0;
            for (let zombie of zombies) {
                const isBoss = zombie.classList.contains('boss');
                totalDamage += isBoss ? (0.5 + (round * 0.1)) * 3 : (0.5 + (round * 0.1));
            }
            playerHealth = Math.max(0, playerHealth - totalDamage); // Prevent negative health
            updateHealthBar();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    gameOver.style.display = 'block';
    music.pause();
    gameArea.style.display = 'none';
}