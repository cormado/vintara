class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        const { width, height } = this.sys.game.config;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 1);
        bg.fillRect(0, 0, width, height);
        for (let y = 0; y <= height; y += 40) {
            bg.lineStyle(1, 0x222222, 0.6);
            bg.lineBetween(0, y, width, y);
        }

        const frame = this.add.graphics();
        frame.lineStyle(2, 0xffffff, 0.8);
        frame.strokeRect(10, 10, width - 20, height - 20);

        const logo = this.add.text(width / 2, height * 0.25, 'Rythmic', {
            fontSize: '64px',
            color: '#ffffff',
            fontStyle: 'bold',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10, fill: true }
        }).setOrigin(0.5);
        logo.setAlpha(0);
        this.tweens.add({
            targets: logo,
            alpha: 1,
            duration: 1500,
            ease: 'Power2'
        });

        const startContainer = this.add.container(width / 2, height * 0.5);
        const startButton = this.add.graphics();
        startButton.fillStyle(0xffffff, 0.15);
        startButton.fillRoundedRect(-60, -30, 120, 60, 10);
        startButton.lineStyle(2, 0xffffff, 0.8);
        startButton.strokeRoundedRect(-60, -30, 120, 60, 10);
        startButton.setInteractive(new Phaser.Geom.Rectangle(-60, -30, 120, 60), Phaser.Geom.Rectangle.Contains);

        const startText = this.add.text(0, 0, 'Start', {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 5 }
        }).setOrigin(0.5);

        startContainer.add([startButton, startText]);
        startContainer.setAlpha(0);

        this.tweens.add({
            targets: startContainer,
            alpha: 1,
            duration: 1500,
            delay: 500,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: startContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        startButton.on('pointerdown', () => this.scene.start('SongMenuScene'));
        startButton.on('pointerover', () => {
            startButton.clear();
            startButton.fillStyle(0xffffff, 0.25);
            startButton.fillRoundedRect(-60, -30, 120, 60, 10);
            startButton.lineStyle(2, 0xffffff, 0.8);
            startButton.strokeRoundedRect(-60, -30, 120, 60, 10);
        });
        startButton.on('pointerout', () => {
            startButton.clear();
            startButton.fillStyle(0xffffff, 0.15);
            startButton.fillRoundedRect(-60, -30, 120, 60, 10);
            startButton.lineStyle(2, 0xffffff, 0.8);
            startButton.strokeRoundedRect(-60, -30, 120, 60, 10);
        });
    }
}

class SongMenuScene extends Phaser.Scene {
    constructor() {
        super('SongMenuScene');
    }

    create() {
        const { width, height } = this.sys.game.config;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 1);
        bg.fillRect(0, 0, width, height);
        for (let y = 0; y <= height; y += 40) {
            bg.lineStyle(1, 0x222222, 0.6);
            bg.lineBetween(0, y, width, y);
        }

        const frame = this.add.graphics();
        frame.lineStyle(2, 0xffffff, 0.8);
        frame.strokeRect(10, 10, width - 20, height - 20);

        const selectedSong = this.add.text(width / 2, height * 0.125, 'Nightcore - Go Go Go', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        }).setOrigin(0.5);
        const selectedArtist = this.add.text(width / 2, height * 0.175, 'Chopis', {
            fontSize: '24px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 5 }
        }).setOrigin(0.5);

        const songItems = [
            { title: 'Nightcore - Go Go Go', artist: 'Chopis', id: 'song1' },
            { title: 'Galaxy Collapse', artist: 'Kurokotei', id: 'song2' },
            { title: 'Sample Song 1', artist: 'Sample Artist 1', id: 'song3' },
            { title: 'Sample Song 2', artist: 'Sample Artist 2', id: 'song4' }
        ];

        songItems.forEach((item, index) => {
            const yPos = height * 0.3125 + (index * 100);
            const songRect = this.add.rectangle(width / 2, yPos, width * 0.7, 80, 0x000000)
                .setAlpha(0.8)
                .setStrokeStyle(1, 0xffffff, 0.7)
                .setInteractive();
            const songTitle = this.add.text(width * 0.15, yPos - 20, item.title, {
                fontSize: '24px',
                color: '#ffffff',
                shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 5 }
            }).setOrigin(0, 0.5);
            const songArtist = this.add.text(width * 0.15, yPos + 20, item.artist, {
                fontSize: '18px',
                color: '#cccccc',
                shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 5 }
            }).setOrigin(0, 0.5);

            songRect.on('pointerover', () => songRect.setFillStyle(0x333333, 0.8));
            songRect.on('pointerout', () => songRect.setFillStyle(0x000000, 0.8));
            songRect.on('pointerdown', () => {
                selectedSong.setText(item.title);
                selectedArtist.setText(item.artist);
                console.log(`Song selected: ${item.title} (ID: ${item.id})`);
                this.scene.start('DifficultyScene', { song: item.id });
            });
        });
    }
}

class DifficultyScene extends Phaser.Scene {
    constructor() {
        super('DifficultyScene');
    }

    init(data) {
        this.currentSong = data.song;
        console.log(`DifficultyScene: Song received - ${this.currentSong}`);
    }

    create() {
        const { width, height } = this.sys.game.config;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 1);
        bg.fillRect(0, 0, width, height);
        for (let y = 0; y <= height; y += 40) {
            bg.lineStyle(1, 0x222222, 0.6);
            bg.lineBetween(0, y, width, y);
        }

        const frame = this.add.graphics();
        frame.lineStyle(2, 0xffffff, 0.8);
        frame.strokeRect(10, 10, width - 20, height - 20);

        const logo = this.add.text(width / 2, height * 0.125, 'Select Difficulty', {
            fontSize: '36px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        }).setOrigin(0.5);

        const easyButton = this.add.rectangle(width / 2, height * 0.3125, width * 0.25, 60, 0xffffff)
            .setInteractive()
            .setStrokeStyle(1, 0xffffff, 0.8);
        this.add.text(width / 2, height * 0.3125, 'Easy', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        easyButton.on('pointerdown', () => this.startGameWithLoading('easy'));
        easyButton.on('pointerover', () => easyButton.setFillStyle(0xcccccc));
        easyButton.on('pointerout', () => easyButton.setFillStyle(0xffffff));

        const mediumButton = this.add.rectangle(width / 2, height * 0.4375, width * 0.25, 60, 0xffffff)
            .setInteractive()
            .setStrokeStyle(1, 0xffffff, 0.8);
        this.add.text(width / 2, height * 0.4375, 'Medium', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        mediumButton.on('pointerdown', () => this.startGameWithLoading('medium'));
        mediumButton.on('pointerover', () => mediumButton.setFillStyle(0xcccccc));
        mediumButton.on('pointerout', () => mediumButton.setFillStyle(0xffffff));

        const hardButton = this.add.rectangle(width / 2, height * 0.5625, width * 0.25, 60, 0xffffff)
            .setInteractive()
            .setStrokeStyle(1, 0xffffff, 0.8);
        this.add.text(width / 2, height * 0.5625, 'Hard', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        hardButton.on('pointerdown', () => this.startGameWithLoading('hard'));
        hardButton.on('pointerover', () => hardButton.setFillStyle(0xcccccc));
        hardButton.on('pointerout', () => hardButton.setFillStyle(0xffffff));

        const backButton = this.add.rectangle(width / 2, height * 0.6875, width * 0.225, 60, 0xffffff)
            .setInteractive()
            .setStrokeStyle(1, 0xffffff, 0.8);
        this.add.text(width / 2, height * 0.6875, 'Back to Songs', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        backButton.on('pointerdown', () => this.scene.start('SongMenuScene'));
        backButton.on('pointerover', () => backButton.setFillStyle(0xcccccc));
        backButton.on('pointerout', () => backButton.setFillStyle(0xffffff));
    }

    startGameWithLoading(difficulty) {
        console.log(`startGameWithLoading called with difficulty: ${difficulty}`);
        console.log(`Starting GameScene with song: ${this.currentSong}, difficulty: ${difficulty}`);
        this.scene.start('GameScene', { song: this.currentSong, difficulty: difficulty });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.currentSong = data.song || 'song1';
        this.difficulty = data.difficulty || 'medium';
        this.hitZones = [];
        this.combo = 0;
        this.songDuration = this.currentSong === 'song1' ? 183000 : 407000;
        this.startTime = null;
        this.blockSpeed = this.difficulty === 'easy' ? 3 : this.difficulty === 'hard' ? 7 : 5;
        console.log(`GameScene started: Song - ${this.currentSong}, Duration - ${this.songDuration}ms, Difficulty - ${this.difficulty}, Block Speed - ${this.blockSpeed}`);
    }

    preload() {
        try {
            this.load.audio('song1', 'gogogo.mp3');
            this.load.audio('song2', 'galaxycollapse.mp3');
            console.log('Audio files loaded in preload.');
        } catch (error) {
            console.error('Error loading audio files:', error);
            document.getElementById('error-display').style.display = 'block';
            document.getElementById('error-display').textContent = 'Error loading audio files. Check console for details.';
        }
    }

    create() {
        console.log('GameScene: create executed for song:', this.currentSong);
        this.score = 0;
        this.health = 100;
        this.perfectHits = 0;
        this.goodHits = 0;
        this.blocks = [];
        this.gameActive = true;
        this.combo = 0;
        this.startTime = this.time.now;

        const { width, height } = this.sys.game.config;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 1);
        bg.fillRect(0, 0, width, height);
        for (let y = 0; y <= height; y += 40) {
            bg.lineStyle(1, 0x222222, 0.6);
            bg.lineBetween(0, y, width, y);
        }

        const frame = this.add.graphics();
        frame.lineStyle(2, 0xffffff, 0.8);
        frame.strokeRect(10, 10, width - 20, height - 20);

        const scanLine = this.add.rectangle(15, 15, width - 30, 1, 0xffffff).setOrigin(0);
        this.tweens.add({
            targets: scanLine,
            y: height - 15,
            duration: 4000,
            repeat: -1
        });

        const laneCount = 4;
        for (let i = 0; i < laneCount; i++) {
            for (let y = 50; y < height; y += 100) {
                this.add.rectangle(i * (width / laneCount) + (width / laneCount * 0.25), y, width / laneCount * 0.5, 2, 0x666666).setOrigin(0, 0.5);
            }
            this.hitZones[i] = this.add.rectangle(i * (width / laneCount) + (width / laneCount * 0.5), height * 0.875, width / laneCount, height * 0.125, 0xffffff)
                .setAlpha(0.7)
                .setStrokeStyle(2, 0xffffff);
            this.hitZones[i].setInteractive(); // Make hit zones interactive for touch
            console.log(`Hit zone ${i} created at x: ${i * (width / laneCount) + (width / laneCount * 0.5)}, y: ${height * 0.875}, width: ${width / laneCount}, height: ${height * 0.125}`);
        }

        for (let i = 1; i < laneCount; i++) {
            this.add.line(0, 0, i * (width / laneCount), 0, i * (width / laneCount), height, 0xffffff, 1).setOrigin(0);
        }

        this.scoreText = this.add.text(10, 10, 'Score: 0', {
            fontSize: '24px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        });
        this.comboText = this.add.text(width / 2, height * 0.0625, 'Combo: 0', {
            fontSize: '20px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        }).setOrigin(0.5);
        this.healthBorder = this.add.rectangle(width - 10, height * 0.0375, width * 0.1925, 24, 0xffffff).setOrigin(1, 0.5);
        this.healthBar = this.add.rectangle(width - 12, height * 0.035, width * 0.1875, 20, 0xaaaaaa).setOrigin(1, 0.5);

        this.difficultyText = this.add.text(10, height * 0.05, `Difficulty: ${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)}`, {
            fontSize: '20px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        });

        this.progressBarBorder = this.add.rectangle(width / 2, height * 0.9625, width * 0.95, 20, 0xffffff).setOrigin(0.5);
        this.progressBar = this.add.rectangle(20, height * 0.95, 0, 20, 0xaaaaaa).setOrigin(0);

        const basePatterns = {
            song1: Array.from({ length: 549 }, (_, i) => ({
                time: i * 333
            })),
            song2: [
                ...Array.from({ length: 108 }, (_, i) => ({
                    time: i * 250
                })),
                ...Array.from({ length: 435 }, (_, i) => ({
                    time: 30000 + i * 200
                })),
                ...Array.from({ length: 97 }, (_, i) => ({
                    time: 117000 + i * 400
                })),
                ...Array.from({ length: 50 }, (_, i) => ({
                    time: 156000 + i * (400 - (i / 50) * 200)
                })),
                ...Array.from({ length: 425 }, (_, i) => ({
                    time: 179000 + i * 120
                })),
                ...Array.from({ length: 210 }, (_, i) => ({
                    time: 230000 + i * 200
                })),
                ...Array.from({ length: 72 }, (_, i) => ({
                    time: 272000 + i * 400
                })),
                ...Array.from({ length: 416 }, (_, i) => ({
                    time: 304000 + i * 120
                })),
                ...Array.from({ length: 212 }, (_, i) => ({
                    time: 354000 + i * 250
                }))
            ].sort((a, b) => a.time - b.time),
            song3: Array.from({ length: 300 }, (_, i) => ({
                time: i * 500
            })),
            song4: Array.from({ length: 300 }, (_, i) => ({
                time: i * 500
            }))
        };

        this.songPatterns = {
            song1: this.adjustPatternFrequency(basePatterns.song1, this.difficulty),
            song2: this.adjustPatternFrequency(basePatterns.song2, this.difficulty),
            song3: this.adjustPatternFrequency(basePatterns.song3, this.difficulty),
            song4: this.adjustPatternFrequency(basePatterns.song4, this.difficulty)
        };

        if (!this.songPatterns[this.currentSong]) {
            console.error(`No pattern found for song: ${this.currentSong}. Using song1 as fallback.`);
            this.currentSong = 'song1';
        }

        this.songAudio = this.sound.add(this.currentSong);
        if (this.songAudio) {
            console.log(`Playing audio for ${this.currentSong}`);
            this.songAudio.play();
            this.time.delayedCall(this.songDuration, this.checkSongEnd, [], this);
        } else {
            console.warn(`Failed to load audio for ${this.currentSong}. Continuing without audio.`);
        }

        const pattern = this.songPatterns[this.currentSong];
        pattern.forEach(blockData => {
            this.time.delayedCall(blockData.time, () => {
                if (this.gameActive) {
                    const lane = Phaser.Math.Between(0, 3);
                    const block = this.add.rectangle(lane * (width / 4) + (width / 8), -10, width / 8, 20, 0xffffff)
                        .setStrokeStyle(4, 0xffffff)
                        .setOrigin(0, 0);
                    console.log(`Block created in lane ${lane}, x: ${block.x}, y: ${block.y}`);
                    this.blocks.push({ sprite: block, lane: lane });
                }
            });
        });

        // Keyboard input
        this.input.keyboard.on('keydown-F', () => this.handleInput(0));
        this.input.keyboard.on('keydown-G', () => this.handleInput(1));
        this.input.keyboard.on('keydown-H', () => this.handleInput(2));
        this.input.keyboard.on('keydown-J', () => this.handleInput(3));

        // Touch input for mobile
        this.hitZones.forEach((zone, index) => {
            zone.on('pointerdown', () => {
                this.handleInput(index);
            });
        });
    }

    adjustPatternFrequency(pattern, difficulty) {
        let adjustedPattern = [...pattern];
        if (difficulty === 'easy' && adjustedPattern.length > 0) {
            adjustedPattern = adjustedPattern.filter((_, index) => index % 2 === 0);
        } else if (difficulty === 'hard' && adjustedPattern.length > 0) {
            const newBlocks = adjustedPattern.map(block => ({
                time: block.time + 150
            }));
            adjustedPattern = [...adjustedPattern, ...newBlocks].sort((a, b) => a.time - b.time);
        }
        console.log(`Pattern adjusted for ${difficulty}: ${adjustedPattern.length} blocks`);
        return adjustedPattern.length > 0 ? adjustedPattern : [{ time: 0 }]; // Fallback to prevent empty pattern
    }

    update() {
        if (!this.gameActive) return;

        this.blocks.forEach((block, index) => {
            block.sprite.y += this.blockSpeed;
            console.log(`Block in lane ${block.lane}, x: ${block.sprite.x}, y: ${block.sprite.y}`);
            if (block.sprite.y > this.sys.game.config.height) {
                block.sprite.destroy();
                this.blocks.splice(index, 1);
                if (this.health > 0) {
                    this.health = Math.max(0, this.health - 20);
                    this.updateHealthBar();
                    this.showFailAnimation(block.lane);
                    if (this.health <= 0) this.endGame();
                    this.combo = 0;
                    this.comboText.setText(`Combo: ${this.combo}`);
                }
            }
        });

        if (this.startTime && this.songAudio) {
            const elapsed = this.time.now - this.startTime;
            const progress = Math.min(elapsed / this.songDuration, 1);
            this.progressBar.width = (this.sys.game.config.width - 40) * progress;
        }
    }

    handleInput(lane) {
        if (!this.gameActive) return;
        console.log(`Input detected: lane ${lane}`);
        let hit = false;
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block.lane === lane) {
                const blockY = block.sprite.y;
                console.log(`Checking block in lane ${block.lane}, y ${blockY}, target lane ${lane}`);
                if (blockY >= this.sys.game.config.height * 0.75 && blockY <= this.sys.game.config.height * 0.875) {
                    block.sprite.destroy();
                    this.blocks.splice(i, 1);
                    this.score += 10;
                    this.health = Math.min(100, this.health + 10);
                    this.perfectHits++;
                    this.combo++;
                    this.spawnParticles(lane, 0xffffff);
                    this.showFeedbackText(lane, 'Perfect!');
                    this.scoreText.setText(`Score: ${this.score}`);
                    this.comboText.setText(`Combo: ${this.combo}`);
                    this.updateHealthBar();
                    this.showSuccessAnimation(lane);
                    hit = true;
                    console.log("Perfect hit detected!");
                    break;
                } else if (blockY >= this.sys.game.config.height * 0.625 && blockY <= this.sys.game.config.height) {
                    block.sprite.destroy();
                    this.blocks.splice(i, 1);
                    this.score += 5;
                    this.health = Math.max(0, this.health - 5);
                    this.goodHits++;
                    this.combo++;
                    this.spawnParticles(lane, 0xffffff);
                    this.showFeedbackText(lane, 'Good!');
                    this.scoreText.setText(`Score: ${this.score}`);
                    this.comboText.setText(`Combo: ${this.combo}`);
                    this.updateHealthBar();
                    this.showGoodAnimation(lane);
                    hit = true;
                    console.log("Good hit detected!");
                    break;
                }
            }
        }
        if (!hit && this.health > 0) {
            this.health = Math.max(0, this.health - 10);
            this.updateHealthBar();
            this.showFailAnimation(lane);
            this.combo = 0;
            this.comboText.setText(`Combo: ${this.combo}`);
            console.log("Miss detected, health reduced");
            if (this.health <= 0) this.endGame();
        }
    }

    spawnParticles(lane, color) {
        const { width, height } = this.sys.game.config;
        for (let i = 0; i < 10; i++) {
            const xOffset = Math.random() * (width / 4) - (width / 8) + (lane * (width / 4) + (width / 8));
            const particle = this.add.star(xOffset, height * 0.875, 5, 5, 10, color);
            this.tweens.add({
                targets: particle,
                y: height * 0.8125,
                scale: 0.2,
                alpha: 0,
                duration: 800,
                angle: Phaser.Math.Between(0, 360),
                onComplete: () => particle.destroy()
            });
        }
    }

    showFeedbackText(lane, message) {
        const { width, height } = this.sys.game.config;
        const text = this.add.text(lane * (width / 4) + (width / 8), height * 0.8125, message, {
            fontSize: '20px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        }).setOrigin(0.5);
        this.tweens.add({
            targets: text,
            y: height * 0.75,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });
    }

    updateHealthBar() {
        this.healthBar.scaleX = Math.max(0, Math.min(1, this.health / 100));
        this.healthBar.setFillStyle(this.health > 0 ? 0xaaaaaa : 0x000000);
    }

    showSuccessAnimation(lane) {
        const zone = this.hitZones[lane];
        zone.setFillStyle(0x00ff00, 1); // Green for perfect hit
        this.tweens.add({
            targets: zone,
            alpha: 0.7,
            duration: 300,
            onComplete: () => zone.setFillStyle(0xffffff, 0.7)
        });
    }

    showGoodAnimation(lane) {
        const zone = this.hitZones[lane];
        zone.setFillStyle(0xffff00, 1); // Yellow for good hit
        this.tweens.add({
            targets: zone,
            alpha: 0.7,
            duration: 300,
            onComplete: () => zone.setFillStyle(0xffffff, 0.7)
        });
    }

    showFailAnimation(lane) {
        const zone = this.hitZones[lane];
        zone.setFillStyle(0xff0000, 1); // Red for miss
        this.tweens.add({
            targets: zone,
            alpha: 0.7,
            duration: 300,
            onComplete: () => zone.setFillStyle(0xffffff, 0.7)
        });
    }

    checkSongEnd() {
        if (this.gameActive) {
            this.gameActive = false;
            if (this.songAudio) this.songAudio.stop();
            this.blocks.forEach(block => block.sprite.destroy());
            this.blocks = [];
            this.scene.start('WinScene', { score: this.score, perfectHits: this.perfectHits, goodHits: this.goodHits });
        }
    }

    endGame() {
        if (this.gameActive) {
            this.gameActive = false;
            if (this.songAudio) this.songAudio.stop();
            this.blocks.forEach(block => block.sprite.destroy());
            this.blocks = [];
            this.scene.start('GameOverScene', { song: this.currentSong, difficulty: this.difficulty });
        }
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.currentSong = data.song;
        this.difficulty = data.difficulty;
    }

    create() {
        const { width, height } = this.sys.game.config;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 1);
        bg.fillRect(0, 0, width, height);
        for (let y = 0; y <= height; y += 40) {
            bg.lineStyle(1, 0x222222, 0.6);
            bg.lineBetween(0, y, width, y);
        }

        const frame = this.add.graphics();
        frame.lineStyle(2, 0xffffff, 0.8);
        frame.strokeRect(10, 10, width - 20, height - 20);

        this.add.text(width / 2, height * 0.375, 'Game Over!', {
            fontSize: '36px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        }).setOrigin(0.5);

        const restartButton = this.add.rectangle(width / 2, height * 0.5, width * 0.15, 60, 0xffffff)
            .setInteractive()
            .setStrokeStyle(1, 0xffffff, 0.8);
        this.add.text(width / 2, height * 0.5, 'Restart', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        restartButton.on('pointerdown', () => this.scene.start('GameScene', { song: this.currentSong, difficulty: this.difficulty }));
        restartButton.on('pointerover', () => restartButton.setFillStyle(0xcccccc));
        restartButton.on('pointerout', () => restartButton.setFillStyle(0xffffff));

        const menuButton = this.add.rectangle(width / 2, height * 0.625, width * 0.225, 60, 0xffffff)
            .setInteractive()
            .setStrokeStyle(1, 0xffffff, 0.8);
        this.add.text(width / 2, height * 0.625, 'Back to Menu', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        menuButton.on('pointerdown', () => this.scene.start('StartScene'));
        menuButton.on('pointerover', () => menuButton.setFillStyle(0xcccccc));
        menuButton.on('pointerout', () => menuButton.setFillStyle(0xffffff));
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    init(data) {
        this.score = data.score;
        this.perfectHits = data.perfectHits;
        this.goodHits = data.goodHits;
    }

    create() {
        const { width, height } = this.sys.game.config;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 1);
        bg.fillRect(0, 0, width, height);
        for (let y = 0; y <= height; y += 40) {
            bg.lineStyle(1, 0x222222, 0.6);
            bg.lineBetween(0, y, width, y);
        }

        const frame = this.add.graphics();
        frame.lineStyle(2, 0xffffff, 0.8);
        frame.strokeRect(10, 10, width - 20, height - 20);

        this.add.text(width / 2, height * 0.375, 'You Win!', {
            fontSize: '36px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        }).setOrigin(0.5);
        this.add.text(width / 2, height * 0.4375, `Perfect Hits: ${this.perfectHits}, Good Hits: ${this.goodHits}, Score: ${this.score}`, {
            fontSize: '20px',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
        }).setOrigin(0.5);

        const menuButton = this.add.rectangle(width / 2, height * 0.5625, width * 0.225, 60, 0xffffff)
            .setInteractive()
            .setStrokeStyle(1, 0xffffff, 0.8);
        this.add.text(width / 2, height * 0.5625, 'Back to Menu', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        menuButton.on('pointerdown', () => this.scene.start('StartScene'));
        menuButton.on('pointerover', () => menuButton.setFillStyle(0xcccccc));
        menuButton.on('pointerout', () => menuButton.setFillStyle(0xffffff));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [StartScene, SongMenuScene, DifficultyScene, GameScene, GameOverScene, WinScene],
    render: {
        pixelArt: false,
        antialias: true
    },
    audio: {
        disableWebAudio: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

if (typeof Phaser === 'undefined') {
    console.error('Phaser has not loaded correctly. Check your connection or the CDN.');
    document.getElementById('error-display').style.display = 'block';
    document.getElementById('error-display').textContent = 'Error: Phaser is not available. Check console for details.';
} else {
    try {
        let game = new Phaser.Game(config);
        console.log('Phaser loaded correctly, starting game...');
    } catch (error) {
        console.error('Error initializing Phaser game:', error);
        document.getElementById('error-display').style.display = 'block';
        document.getElementById('error-display').textContent = 'Error initializing game. Check console for details.';
    }
}