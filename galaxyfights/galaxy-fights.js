const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const killSound = document.getElementById('killSound');
const shotLSound = document.getElementById('shotLSound');
const shotESound = document.getElementById('shotESound');

let player, enemies, bullets, particles, powerUps;
let score = 0, level = 1, kills = 0, lives = 3;
let gameActive = false;
let shield = 0, shieldColorTimer = 0;
const bossColors = ['#f0f', '#0ff', '#ff0', '#f90', '#90f'];

function init() {
    player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 40,
        width: 30,
        height: 20,
        speed: 7 // Increased from 5 to 7
    };
    enemies = [];
    bullets = [];
    particles = [];
    powerUps = [];
    spawnEnemies();
    updateLivesDisplay();
}

function spawnEnemies() {
    if (level % 10 === 0) {
        const bossHealth = 10 + Math.floor(level / 10) * 10;
        enemies.push({
            x: canvas.width / 2 - 30,
            y: 50,
            width: 60,
            height: 30,
            speed: 2,
            shootTimer: Math.random() * 50,
            health: bossHealth,
            color: bossColors[Math.floor(level / 10) % bossColors.length]
        });
    } else {
        const enemyCount = 5 + Math.floor(level / 2);
        for (let i = 0; i < enemyCount; i++) {
            enemies.push({
                x: 50 + (i % 10) * 70,
                y: 50 + Math.floor(i / 10) * 50,
                width: 30,
                height: 20,
                speed: 1 + level * 0.2,
                shootTimer: Math.random() * 100
            });
        }
    }
}

function spawnPowerUp(x, y) {
    if (Math.random() < 0.1) {
        powerUps.push({
            x: x,
            y: y,
            width: 15,
            height: 15,
            type: Math.random() < 0.5 ? 'life' : 'shield'
        });
    }
}

function drawHeart(x, y) {
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(x, y + 14);
    ctx.bezierCurveTo(x, y + 6, x - 10, y + 6, x - 10, y + 14);
    ctx.bezierCurveTo(x - 10, y + 22, x, y + 22, x, y + 28);
    ctx.bezierCurveTo(x, y + 22, x + 10, y + 22, x + 10, y + 14);
    ctx.bezierCurveTo(x + 10, y + 6, x, y + 6, x, y + 14);
    ctx.fill();
}

function updateLivesDisplay() {
    ctx.clearRect(0, 0, 150, 50);
    for (let i = 0; i < lives; i++) {
        drawHeart(20 + i * 35, 10);
    }
}

function drawPlayer(x, y) {
    let color = '#fff';
    if (shield > 0) {
        shieldColorTimer = (shieldColorTimer + 1) % 20;
        color = shieldColorTimer < 5 ? '#f00' : shieldColorTimer < 10 ? '#0f0' : shieldColorTimer < 15 ? '#00f' : '#ff0';
    }
    ctx.fillStyle = color;
    ctx.fillRect(x + 10, y - 5, 10, 5);  // Cockpit
    ctx.fillRect(x, y, 30, 5);          // Body top
    ctx.fillRect(x + 5, y + 5, 20, 5);  // Body middle
    ctx.fillRect(x + 10, y + 10, 10, 5); // Body bottom
    ctx.fillRect(x, y + 5, 5, 5);       // Left wing top
    ctx.fillRect(x, y + 10, 5, 5);      // Left wing bottom
    ctx.fillRect(x + 25, y + 5, 5, 5);  // Right wing top
    ctx.fillRect(x + 25, y + 10, 5, 5); // Right wing bottom
    ctx.fillStyle = '#f00';              // Red engines
    ctx.fillRect(x, y + 15, 5, 5);      // Left engine
    ctx.fillRect(x + 25, y + 15, 5, 5); // Right engine
    ctx.fillStyle = '#00f';              // Blue cannons
    ctx.fillRect(x + 5, y + 5, 5, 5);   // Left cannon
    ctx.fillRect(x + 20, y + 5, 5, 5);  // Right cannon
}

function drawEnemy(x, y, isBoss = false, bossColor = '#f00') {
    ctx.fillStyle = isBoss ? bossColor : '#0ff'; // Changed from '#00f' to '#0ff'
    if (isBoss) {
        ctx.fillRect(x, y, 60, 10);          // Top body
        ctx.fillRect(x + 5, y + 10, 50, 10);  // Middle body
        ctx.fillRect(x + 15, y + 20, 30, 10); // Bottom body
        ctx.fillRect(x + 10, y + 10, 5, 5);   // Left eye
        ctx.fillRect(x + 45, y + 10, 5, 5);   // Right eye
        ctx.fillRect(x + 5, y + 15, 5, 5);    // Left detail
        ctx.fillRect(x + 50, y + 15, 5, 5);   // Right detail
    } else {
        ctx.fillStyle = '#0ff';          // Cyan body
        ctx.fillRect(x + 10, y - 5, 10, 5);  // Cockpit
        ctx.fillRect(x, y, 30, 5);       // Body top
        ctx.fillRect(x + 5, y + 5, 20, 5);   // Body middle
        ctx.fillRect(x + 10, y + 10, 10, 5); // Body bottom
        ctx.fillRect(x, y + 5, 5, 5);    // Left wing top
        ctx.fillRect(x, y + 10, 5, 5);   // Left wing bottom
        ctx.fillRect(x + 25, y + 5, 5, 5); // Right wing top
        ctx.fillRect(x + 25, y + 10, 5, 5); // Right wing bottom
        ctx.fillStyle = '#f00';          // Red engines
        ctx.fillRect(x, y + 15, 5, 5);   // Left engine
        ctx.fillRect(x + 25, y + 15, 5, 5); // Right engine
        ctx.fillStyle = '#fff';          // White cannons
        ctx.fillRect(x + 5, y + 5, 5, 5);   // Left cannon
        ctx.fillRect(x + 20, y + 5, 5, 5);  // Right cannon
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Background stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }

    // Draw player
    drawPlayer(player.x, player.y);

    // Draw enemies
    enemies.forEach(enemy => {
        drawEnemy(enemy.x, enemy.y, enemy.health !== undefined, enemy.color);
    });

    // Draw bullets (player white, enemy yellow)
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.speed < 0 ? '#fff' : '#ff0';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.fillRect(bullet.x - 2, bullet.y + (bullet.speed < 0 ? -2 : 2), 2, 2);
    });

    // Draw particles
    particles.forEach(particle => {
        ctx.fillStyle = `rgba(255, 0, 0, ${particle.alpha})`;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });

    // Draw power-ups
    powerUps.forEach(power => {
        ctx.fillStyle = power.type === 'life' ? '#0f0' : '#00f';
        ctx.fillRect(power.x, power.y, power.width, power.height);
        ctx.fillRect(power.x + 5, power.y + 5, 5, 5);
    });

    updateLivesDisplay();
}

function update() {
    if (!gameActive) return;

    // Player movement
    if ((keys.ArrowLeft || keys.KeyA) && player.x > 0) player.x -= player.speed;
    if ((keys.ArrowRight || keys.KeyD) && player.x < canvas.width - player.width) player.x += player.speed;

    // Enemy movement and shooting
    enemies.forEach(enemy => {
        enemy.x += enemy.speed;
        if (enemy.x <= 0 || enemy.x >= canvas.width - (enemy.health ? 60 : 30)) enemy.speed = -enemy.speed;
        
        enemy.shootTimer--;
        if (enemy.shootTimer <= 0) {
            bullets.push({ x: enemy.x + (enemy.health ? 30 : 12), y: enemy.y + (enemy.health ? 30 : 20), width: 5, height: 10, speed: 5 + level * 0.2 });
            shotESound.play();
            enemy.shootTimer = enemy.health ? 50 - level : 100 - level * 2;
        }
    });

    // Bullet movement
    bullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y < 0 || bullet.y > canvas.height) bullets.splice(index, 1);
    });

    // Collision detection
    bullets.forEach((bullet, bIndex) => {
        if (bullet.speed < 0) { // Player bullets
            enemies.forEach((enemy, eIndex) => {
                if (collision(bullet, enemy)) {
                    if (enemy.health) {
                        enemy.health--;
                        if (enemy.health <= 0) {
                            for (let i = 0; i < 20; i++) {
                                particles.push({
                                    x: enemy.x + 30,
                                    y: enemy.y + 15,
                                    size: 5,
                                    vx: (Math.random() - 0.5) * 3,
                                    vy: (Math.random() - 0.5) * 3,
                                    alpha: 1
                                });
                            }
                            killSound.play();
                            enemies.splice(eIndex, 1);
                            score += 100;
                            kills++;
                            level++;
                            spawnEnemies();
                            levelUp(); // Trigger level-up text
                        }
                    } else {
                        for (let i = 0; i < 10; i++) {
                            particles.push({
                                x: enemy.x + 15,
                                y: enemy.y + 10,
                                size: 3,
                                vx: (Math.random() - 0.5) * 2,
                                vy: (Math.random() - 0.5) * 2,
                                alpha: 1
                            });
                        }
                        killSound.play();
                        enemies.splice(eIndex, 1);
                        score += 10;
                        kills++;
                        spawnPowerUp(enemy.x, enemy.y);
                        if (enemies.length === 0) {
                            level++;
                            spawnEnemies();
                            levelUp(); // Trigger level-up text
                        }
                    }
                    bullets.splice(bIndex, 1);
                }
            });
        } else { // Enemy bullets
            if (collision(bullet, player)) {
                bullets.splice(bIndex, 1);
                if (shield > 0) {
                    shield--;
                } else {
                    lives--;
                    if (lives <= 0) endGame();
                }
            }
        }
    });

    // Particles
    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.05;
        if (p.alpha <= 0) particles.splice(index, 1);
    });

    // Power-ups
    powerUps.forEach((power, index) => {
        power.y += 2;
        if (collision(power, player)) {
            if (power.type === 'life') lives++;
            else shield = 5;
            powerUps.splice(index, 1);
        }
        if (power.y > canvas.height) powerUps.splice(index, 1);
    });

    updateInfo();
    draw();
    requestAnimationFrame(update);
}

function collision(a, b) {
    const width = b.health ? 60 : 30;
    const height = b.health ? 30 : 20;
    return a.x < b.x + width && a.x + a.width > b.x && 
           a.y < b.y + height && a.y + a.height > b.y;
}

function updateInfo() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('kills').textContent = kills;
}

function endGame() {
    gameActive = false;
    backgroundMusic.pause();
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: player.x + 15,
            y: player.y + 10,
            size: 3,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            alpha: 1
        });
    }
    setTimeout(() => {
        document.getElementById('gameOverScreen').style.display = 'block';
    }, 1000);
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    init();
    gameActive = true;
    backgroundMusic.play();
    update();
}

// Add level-up text function
function levelUp() {
    ctx.fillStyle = '#fff';
    ctx.font = '30px Courier New';
    ctx.fillText('Level Up!', canvas.width / 2 - 50, canvas.height / 2);
    setTimeout(() => ctx.clearRect(canvas.width / 2 - 50, canvas.height / 2 - 30, 100, 40), 1000);
}

const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if ((e.code === 'ArrowUp' || e.code === 'KeyW') && gameActive && !keys.shooting) {
        bullets.push({ x: player.x + 12, y: player.y - 10, width: 5, height: 10, speed: -7 });
        playShotLSound();
        keys.shooting = true;
    }
});
window.addEventListener('keyup', e => {
    keys[e.code] = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.shooting = false;
});

// Function to play shotL.mp3 multiple times
function playShotLSound() {
    const audio = new Audio('shotL.mp3');
    audio.play().catch(error => console.error('Error al reproducir audio:', error));
}