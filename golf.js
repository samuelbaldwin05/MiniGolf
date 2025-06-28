// Golf Game - JavaScript Implementation

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const BALL_RADIUS = 8;
const HOLE_RADIUS = 12;
const WALL_THICKNESS = 10;
const FRICTION = 0.96;
const MIN_VELOCITY = 0.05;
const MAX_VELOCITY = 1.5;
const HOLE_DETECTION_THRESHOLD = 0.3;
const SAND_FRICTION = 0.75;
const TALL_GRASS_FRICTION = 0.88;
const ICE_FRICTION = 1.0;

// Game states
const GAME_STATES = {
    START: 'start',
    DESIGN: 'design',
    PLAY: 'play',
    WIN: 'win'
};

// Game phases
const PHASES = {
    DESIGN: 'design',
    PLAY: 'play'
};

class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2D(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vector2D(this.x - other.x, this.y - other.y);
    }

    multiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2D(0, 0);
        return new Vector2D(this.x / mag, this.y / mag);
    }

    distance(other) {
        return this.subtract(other).magnitude();
    }
}

class Ball {
    constructor(x, y, color) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.color = color;
        this.radius = BALL_RADIUS;
        this.isMoving = false;
        this.isInHole = false;
        this.initialPosition = new Vector2D(x, y); // Store initial position for respawning
        this.lastPosition = new Vector2D(x, y); // Store last position for water hazards
        this.lastStationaryPosition = new Vector2D(x, y); // Store last position when ball stopped moving
        this.currentFriction = FRICTION; // Track current friction (starts with normal friction)
    }

    update(deltaTime, gameInstance = null) {
        if (this.isMoving && !this.isInHole) {
            // Store last position before moving
            this.lastPosition = new Vector2D(this.position.x, this.position.y);
            
            // Use sub-stepping to prevent tunneling through walls
            const maxStepDistance = this.radius * 0.5; // Maximum distance per step
            const velocityMagnitude = this.velocity.magnitude();
            
            if (velocityMagnitude > 0) {
                const stepDistance = velocityMagnitude * deltaTime;
                const numSteps = Math.max(1, Math.ceil(stepDistance / maxStepDistance));
                const stepTime = deltaTime / numSteps;
                
                for (let i = 0; i < numSteps; i++) {
                    // Move ball by a small step
                    this.position = this.position.add(this.velocity.multiply(stepTime));
                    
                    // Check for collisions after each step
                    if (gameInstance) {
                        gameInstance.checkCollisionsForStep();
                    }
                }
            }
            
            // Apply current friction (which may be terrain-specific)
            this.velocity = this.velocity.multiply(this.currentFriction);
            
            if (this.velocity.magnitude() < MIN_VELOCITY) {
                this.velocity = new Vector2D(0, 0);
                this.isMoving = false;
                // Update last stationary position when ball stops moving
                this.lastStationaryPosition = new Vector2D(this.position.x, this.position.y);
            }
        }
    }

    draw(ctx) {
        if (!this.isInHole) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    reset(x, y) {
        this.position = new Vector2D(x, y);
        this.initialPosition = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.isMoving = false;
        this.isInHole = false;
        this.currentFriction = FRICTION; // Reset to normal friction
    }

    respawn() {
        this.position = new Vector2D(this.initialPosition.x, this.initialPosition.y);
        this.velocity = new Vector2D(0, 0);
        this.isMoving = false;
        this.isInHole = false;
        this.currentFriction = FRICTION; // Reset to normal friction
    }

    isOutOfBounds() {
        return this.position.x < this.radius || 
               this.position.x > CANVAS_WIDTH - this.radius ||
               this.position.y < this.radius || 
               this.position.y > CANVAS_HEIGHT - this.radius;
    }

    // Method to check collisions during sub-stepping (called from game instance)
    checkCollisionsForStep() {
        // This will be called from the game instance
        // The actual collision logic is in the game's checkCollisions method
    }
}

class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'wall';
        // Increase hitbox size to prevent phase-through
        this.hitboxPadding = 4; // Increased from 2 to 4 for better collision detection
    }

    draw(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    intersects(ball) {
        // Use larger hitbox to prevent phase-through
        const expandedX = this.x - this.hitboxPadding;
        const expandedY = this.y - this.hitboxPadding;
        const expandedWidth = this.width + 2 * this.hitboxPadding;
        const expandedHeight = this.height + 2 * this.hitboxPadding;
        
        const closestX = Math.max(expandedX, Math.min(ball.position.x, expandedX + expandedWidth));
        const closestY = Math.max(expandedY, Math.min(ball.position.y, expandedY + expandedHeight));
        
        const distanceX = ball.position.x - closestX;
        const distanceY = ball.position.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getClosestPoint(ball) {
        const expandedX = this.x - this.hitboxPadding;
        const expandedY = this.y - this.hitboxPadding;
        const expandedWidth = this.width + 2 * this.hitboxPadding;
        const expandedHeight = this.height + 2 * this.hitboxPadding;
        
        const closestX = Math.max(expandedX, Math.min(ball.position.x, expandedX + expandedWidth));
        const closestY = Math.max(expandedY, Math.min(ball.position.y, expandedY + expandedHeight));
        
        return new Vector2D(closestX, closestY);
    }
}

class Sand {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'sand';
    }

    draw(ctx) {
        // Create gradient for sand effect
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, '#F4D03F');
        gradient.addColorStop(0.5, '#F7DC6F');
        gradient.addColorStop(1, '#F8C471');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    intersects(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        const distanceX = ball.position.x - closestX;
        const distanceY = ball.position.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getClosestPoint(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        return new Vector2D(closestX, closestY);
    }
}

class TallGrass {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'tallGrass';
    }

    draw(ctx) {
        // Create gradient for tall grass effect
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, '#2E8B57');
        gradient.addColorStop(0.5, '#3CB371');
        gradient.addColorStop(1, '#228B22');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    intersects(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        const distanceX = ball.position.x - closestX;
        const distanceY = ball.position.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getClosestPoint(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        return new Vector2D(closestX, closestY);
    }
}

class Water {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'water';
    }

    draw(ctx) {
        // Create gradient for water effect
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, '#1E90FF');
        gradient.addColorStop(0.5, '#00BFFF');
        gradient.addColorStop(1, '#87CEEB');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    intersects(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        const distanceX = ball.position.x - closestX;
        const distanceY = ball.position.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getClosestPoint(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        return new Vector2D(closestX, closestY);
    }
}

class Ice {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'ice';
    }

    draw(ctx) {
        // Create gradient for ice effect
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, '#E0F6FF');
        gradient.addColorStop(0.5, '#F0F8FF');
        gradient.addColorStop(1, '#E6F3FF');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add subtle ice texture with light blue lines
        ctx.strokeStyle = '#B0E0E6';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const iceY = this.y + (this.height / 4) * (i + 1);
            ctx.beginPath();
            ctx.moveTo(this.x, iceY);
            ctx.lineTo(this.x + this.width, iceY);
            ctx.stroke();
        }
    }

    intersects(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        const distanceX = ball.position.x - closestX;
        const distanceY = ball.position.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getClosestPoint(ball) {
        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
        
        return new Vector2D(closestX, closestY);
    }
}

class Hole {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.radius = HOLE_RADIUS;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    contains(ball) {
        return this.position.distance(ball.position) < this.radius;
    }

    // Check if ball meets the threshold to go in the hole
    isBallHalfIn(ball) {
        const distance = this.position.distance(ball.position);
        return distance < (this.radius - ball.radius * HOLE_DETECTION_THRESHOLD);
    }
}

class GolfGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.currentState = GAME_STATES.START;
        this.currentPhase = PHASES.DESIGN;
        this.currentHole = 1;
        this.totalHoles = 6;
        this.currentPlayer = 1; // 1 = blue, 2 = red
        
        // Design phase toggles
        this.ballMovable = true;
        this.holeMovable = true;
        
        // Dev mode
        this.devMode = false;
        
        // Game objects
        this.ball = new Ball(50, CANVAS_HEIGHT / 2, '#4169E1'); // Blue ball
        this.hole = new Hole(CANVAS_WIDTH - 50, CANVAS_HEIGHT / 2);
        this.walls = [];
        this.boundaryWalls = [];
        
        // Building system
        this.currentBuildingType = 'wall'; // Default to wall
        this.buildingHistory = []; // For undo functionality
        this.isBuilding = false;
        this.buildStart = new Vector2D(0, 0);
        this.buildEnd = new Vector2D(0, 0);
        this.isMovingBuilding = false;
        this.movingBuilding = null;
        this.movingBuildingOffset = new Vector2D(0, 0);
        this.selectedBuilding = null; // For deletion
        
        // Store original spawn position
        this.spawnPosition = new Vector2D(50, CANVAS_HEIGHT / 2);
        
        // Physics
        this.deltaTime = 16; // 60 FPS
        this.lastTime = 0;
        
        // Input handling
        this.isDragging = false;
        this.dragStart = new Vector2D(0, 0);
        this.dragEnd = new Vector2D(0, 0);
        this.showTrajectory = false;
        this.draggingObject = null; // 'ball', 'hole', or null
        
        // Scoring
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1HoleScore = 0;
        this.player2HoleScore = 0;
        
        // Confetti system
        this.confetti = [];
        this.showConfetti = false;
        this.confettiStartTime = 0;
        
        this.initializeBoundaryWalls();
        this.setupEventListeners();
        this.gameLoop();
    }

    initializeBoundaryWalls() {
        // Top wall
        this.boundaryWalls.push(new Wall(0, 0, CANVAS_WIDTH, WALL_THICKNESS));
        // Bottom wall
        this.boundaryWalls.push(new Wall(0, CANVAS_HEIGHT - WALL_THICKNESS, CANVAS_WIDTH, WALL_THICKNESS));
        // Left wall
        this.boundaryWalls.push(new Wall(0, 0, WALL_THICKNESS, CANVAS_HEIGHT));
        // Right wall
        this.boundaryWalls.push(new Wall(CANVAS_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, CANVAS_HEIGHT));
    }

    setupEventListeners() {
        // Start game button
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        // Done building button
        const doneBuildingBtn = document.getElementById('done-building-btn');
        if (doneBuildingBtn) {
            doneBuildingBtn.addEventListener('click', () => {
                this.nextPhase();
            });
        }

        // Show rules button
        const showRulesBtn = document.getElementById('show-rules-btn');
        if (showRulesBtn) {
            showRulesBtn.addEventListener('click', () => {
                this.showRules();
            });
        }

        // Close rules button
        const closeRulesBtn = document.getElementById('close-rules-btn');
        if (closeRulesBtn) {
            closeRulesBtn.addEventListener('click', () => {
                this.hideRules();
            });
        }

        // Close rules × button
        const closeRulesX = document.getElementById('close-rules');
        if (closeRulesX) {
            closeRulesX.addEventListener('click', () => {
                this.hideRules();
            });
        }

        // Show settings button
        const showSettingsBtn = document.getElementById('show-settings-btn');
        if (showSettingsBtn) {
            showSettingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }

        // Close settings button
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                this.hideSettings();
            });
        }

        // Close settings × button
        const closeSettingsX = document.getElementById('close-settings');
        if (closeSettingsX) {
            closeSettingsX.addEventListener('click', () => {
                this.hideSettings();
            });
        }

        // Restart round button
        const restartRoundBtn = document.getElementById('restart-round-btn');
        if (restartRoundBtn) {
            restartRoundBtn.addEventListener('click', () => {
                this.resetHole();
                this.hideSettings();
            });
        }

        // Play again button
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.playAgain();
            });
        }

        // Design toggle buttons
        const ballMovableToggle = document.getElementById('ball-movable-toggle');
        if (ballMovableToggle) {
            ballMovableToggle.addEventListener('change', (e) => {
                this.ballMovable = e.target.checked;
            });
        }

        const holeMovableToggle = document.getElementById('hole-movable-toggle');
        if (holeMovableToggle) {
            holeMovableToggle.addEventListener('change', (e) => {
                this.holeMovable = e.target.checked;
            });
        }

        // Dev mode toggle
        const devModeToggle = document.getElementById('dev-mode-toggle');
        if (devModeToggle) {
            devModeToggle.addEventListener('change', (e) => {
                this.devMode = e.target.checked;
            });
        }

        // Canvas event listeners
        if (this.canvas) {
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.canvas.addEventListener('click', (e) => this.handleClick(e));
        }

        // Global mouse events for dragging outside canvas
        document.addEventListener('mousemove', (e) => this.handleGlobalMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleGlobalMouseUp(e));

        // Close modal when clicking outside
        const rulesModal = document.getElementById('rules-modal');
        if (rulesModal) {
            rulesModal.addEventListener('click', (e) => {
                if (e.target.id === 'rules-modal') {
                    this.hideRules();
                }
            });
        }

        // Close settings modal when clicking outside
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target.id === 'settings-modal') {
                    this.hideSettings();
                }
            });
        }

        // Undo button
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                this.undoLastBuilding();
            });
        }

        // Delete button
        const deleteBtn = document.getElementById('delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteSelectedBuilding();
            });
        }

        // Keyboard events for delete
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                this.deleteSelectedBuilding();
            }
        });

        // Building type selection
        const wallOption = document.getElementById('wall-option');
        if (wallOption) {
            wallOption.addEventListener('click', () => {
                this.selectBuildingType('wall');
            });
        }

        const sandOption = document.getElementById('sand-option');
        if (sandOption) {
            sandOption.addEventListener('click', () => {
                this.selectBuildingType('sand');
            });
        }

        const tallGrassOption = document.getElementById('tall-grass-option');
        if (tallGrassOption) {
            tallGrassOption.addEventListener('click', () => {
                this.selectBuildingType('tallGrass');
            });
        }

        const waterOption = document.getElementById('water-option');
        if (waterOption) {
            waterOption.addEventListener('click', () => {
                this.selectBuildingType('water');
            });
        }

        const iceOption = document.getElementById('ice-option');
        if (iceOption) {
            iceOption.addEventListener('click', () => {
                this.selectBuildingType('ice');
            });
        }
    }

    startGame() {
        this.totalHoles = parseInt(document.getElementById('hole-count').value);
        this.currentState = GAME_STATES.DESIGN;
        this.currentPhase = PHASES.DESIGN;
        this.currentHole = 1;
        this.currentPlayer = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        
        const startScreen = document.getElementById('start-screen');
        const gameScreen = document.getElementById('game-screen');
        const buildModePanel = document.getElementById('build-mode-panel');
        
        if (startScreen) startScreen.style.display = 'none';
        if (gameScreen) gameScreen.style.display = 'block';
        if (buildModePanel) buildModePanel.style.display = 'block';
        
        this.resetHole();
        this.updateUI();
        this.showMessage(`Player ${this.currentPlayer} building`);
    }

    nextPhase() {
        if (this.currentPhase === PHASES.DESIGN) {
            this.currentPhase = PHASES.PLAY;
            this.ball.reset(this.ball.position.x, this.ball.position.y);
            this.player1HoleScore = 0;
            this.player2HoleScore = 0;
            
            // Hide build mode panel
            const buildModePanel = document.getElementById('build-mode-panel');
            if (buildModePanel) buildModePanel.style.display = 'none';
            
            this.showMessage(`Player ${this.currentPlayer} playing`);
        } else if (this.currentPhase === PHASES.PLAY) {
            // Check if both players have played
            if (this.player1HoleScore > 0 && this.player2HoleScore > 0) {
                // Add hole scores to total scores
                this.player1Score += this.player1HoleScore;
                this.player2Score += this.player2HoleScore;
                
                // Move to next hole or end game
                this.currentHole++;
                if (this.currentHole > this.totalHoles) {
                    this.endGame();
                    return;
                }
                
                this.currentPhase = PHASES.DESIGN;
                // Alternate who designs each hole
                this.currentPlayer = this.currentHole % 2 === 1 ? 1 : 2;
                this.resetHole();
                
                // Show build mode panel
                const buildModePanel = document.getElementById('build-mode-panel');
                if (buildModePanel) buildModePanel.style.display = 'block';
                
                this.showMessage(`Player ${this.currentPlayer} building`);
            }
        }
        
        this.updateUI();
    }

    resetHole() {
        // Reset ball and hole to default positions
        this.ball.reset(this.spawnPosition.x, this.spawnPosition.y);
        this.hole.position = new Vector2D(CANVAS_WIDTH - 50, CANVAS_HEIGHT / 2);
        this.walls = [];
        this.player1HoleScore = 0;
        this.player2HoleScore = 0;
        this.updateUI();
    }

    endGame() {
        this.currentState = GAME_STATES.WIN;
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('win-screen').style.display = 'block';
        
        // Update final scores
        document.getElementById('final-player1-score').textContent = this.player1Score;
        document.getElementById('final-player2-score').textContent = this.player2Score;
        
        // Determine winner
        let winnerText = '';
        if (this.player1Score < this.player2Score) {
            winnerText = 'Player 1 (Blue) wins! 🏆';
        } else if (this.player2Score < this.player1Score) {
            winnerText = 'Player 2 (Red) wins! 🏆';
        } else {
            winnerText = "It's a tie! 🤝";
        }
        
        document.getElementById('winner-text').textContent = winnerText;
    }

    playAgain() {
        this.currentState = GAME_STATES.START;
        document.getElementById('win-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
    }

    showRules() {
        const rulesModal = document.getElementById('rules-modal');
        if (rulesModal) {
            rulesModal.style.display = 'flex';
        }
    }

    hideRules() {
        const rulesModal = document.getElementById('rules-modal');
        if (rulesModal) {
            rulesModal.style.display = 'none';
        }
    }

    showSettings() {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.style.display = 'flex';
        }
    }

    hideSettings() {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.style.display = 'none';
        }
    }

    handleMouseDown(e) {
        if (this.currentPhase === PHASES.PLAY && !this.ball.isMoving) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if clicking on ball
            if (this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius) {
                this.isDragging = true;
                this.dragStart = new Vector2D(x, y);
                this.dragEnd = new Vector2D(x, y);
                this.showTrajectory = true;
            }
        } else if (this.currentPhase === PHASES.DESIGN) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if clicking on hole (only if hole is movable)
            if (this.holeMovable && this.hole.position.distance(new Vector2D(x, y)) < this.hole.radius) {
                this.isDragging = true;
                this.dragStart = new Vector2D(x, y);
                this.dragEnd = new Vector2D(x, y);
                this.draggingObject = 'hole';
                return;
            }
            
            // Check if clicking on ball (only if ball is movable)
            if (this.ballMovable && this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius) {
                this.isDragging = true;
                this.dragStart = new Vector2D(x, y);
                this.dragEnd = new Vector2D(x, y);
                this.draggingObject = 'ball';
                return;
            }
            
            // Start building if clicking on empty space
            const clickingOnHole = this.hole.position.distance(new Vector2D(x, y)) < this.hole.radius;
            const clickingOnBall = this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius;
            
            // Check if clicking on existing building
            const clickedBuilding = this.getBuildingAtPosition(x, y);
            
            if (!clickingOnHole && !clickingOnBall && !clickedBuilding) {
                this.isBuilding = true;
                this.buildStart = new Vector2D(x, y);
                this.buildEnd = new Vector2D(x, y);
                this.selectedBuilding = null; // Clear selection when building new
            } else if (clickedBuilding) {
                // Select the building for potential deletion
                this.selectedBuilding = clickedBuilding;
                
                // Start moving existing building
                this.isMovingBuilding = true;
                this.movingBuilding = clickedBuilding;
                this.movingBuildingOffset = new Vector2D(x - clickedBuilding.x, y - clickedBuilding.y);
            }
        }
    }

    handleMouseMove(e) {
        // Update cursor based on phase and position
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.currentPhase === PHASES.DESIGN) {
            // Check if hovering over hole or ball (only if they're movable)
            const hoveringOverHole = this.holeMovable && this.hole.position.distance(new Vector2D(x, y)) < this.hole.radius;
            const hoveringOverBall = this.ballMovable && this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius;
            const hoveringOverBuilding = this.getBuildingAtPosition(x, y);
            
            if (hoveringOverHole || hoveringOverBall || hoveringOverBuilding) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'crosshair';
            }
        } else {
            // Play phase - check if hovering over ball
            if (this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
    }

    handleGlobalMouseMove(e) {
        if (this.isDragging) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.dragEnd = new Vector2D(x, y);
            
            // Update object position if dragging in design mode
            if (this.currentPhase === PHASES.DESIGN && this.draggingObject) {
                if (this.draggingObject === 'hole' && this.holeMovable) {
                    // Check if new position would overlap with ball, buildings, and is within boundaries
                    const newHolePos = new Vector2D(x, y);
                    if (!this.holeOverlapsBall(newHolePos, this.ball) && 
                        !this.holeOverlapsBuildings(newHolePos) && 
                        this.isWithinBoundaries(x - this.hole.radius, y - this.hole.radius, this.hole.radius * 2, this.hole.radius * 2)) {
                        this.hole.position = newHolePos;
                    }
                } else if (this.draggingObject === 'ball' && this.ballMovable) {
                    // Check if new position would overlap with hole, buildings, and is within boundaries
                    const newBallPos = new Vector2D(x, y);
                    const distance = newBallPos.distance(this.hole.position);
                    
                    // Check if ball would overlap with any buildings
                    let ballOverlapsBuilding = false;
                    for (let building of this.walls) {
                        if (building.x < newBallPos.x + this.ball.radius &&
                            building.x + building.width > newBallPos.x - this.ball.radius &&
                            building.y < newBallPos.y + this.ball.radius &&
                            building.y + building.height > newBallPos.y - this.ball.radius) {
                            ballOverlapsBuilding = true;
                            break;
                        }
                    }
                    
                    if (distance > (this.ball.radius + this.hole.radius) && 
                        !ballOverlapsBuilding && 
                        this.isWithinBoundaries(x - this.ball.radius, y - this.ball.radius, this.ball.radius * 2, this.ball.radius * 2)) {
                        this.ball.position = newBallPos;
                        // Update spawn position when ball is moved during design
                        this.spawnPosition = new Vector2D(x, y);
                    }
                }
            }
        } else if (this.isBuilding) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.buildEnd = new Vector2D(x, y);
        } else if (this.isMovingBuilding && this.movingBuilding) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate new position
            const newX = x - this.movingBuildingOffset.x;
            const newY = y - this.movingBuildingOffset.y;
            
            // Create a temporary building to check collisions
            const tempBuilding = {
                x: newX,
                y: newY,
                width: this.movingBuilding.width,
                height: this.movingBuilding.height,
                type: this.movingBuilding.type,
                intersects: function(ball) {
                    const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
                    const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
                    const distanceX = ball.position.x - closestX;
                    const distanceY = ball.position.y - closestY;
                    return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
                }
            };
            
            // Only move if no collisions and within boundaries
            if (!this.buildingIntersectsObjects(tempBuilding) && this.isWithinBoundaries(newX, newY, tempBuilding.width, tempBuilding.height)) {
                this.movingBuilding.x = newX;
                this.movingBuilding.y = newY;
            }
        }
    }

    handleMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.showTrajectory = false;
            this.draggingObject = null;
            
            // Only calculate shot if in play mode
            if (this.currentPhase === PHASES.PLAY) {
                // Calculate shot with even more sensitive power control
                const direction = this.dragStart.subtract(this.dragEnd);
                const power = Math.min(direction.magnitude() * 0.012, MAX_VELOCITY); // Reduced from 0.02 to 0.012 for even more sensitive control
                const velocity = direction.normalize().multiply(power);
                
                this.shootBall(velocity);
            }
        } else if (this.isBuilding) {
            this.isBuilding = false;
            this.placeBuilding();
        } else if (this.isMovingBuilding) {
            this.isMovingBuilding = false;
            this.movingBuilding = null;
            this.movingBuildingOffset = new Vector2D(0, 0);
        }
    }

    handleGlobalMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.showTrajectory = false;
            this.draggingObject = null;
            
            // Only calculate shot if in play mode
            if (this.currentPhase === PHASES.PLAY) {
                // Calculate shot with even more sensitive power control
                const direction = this.dragStart.subtract(this.dragEnd);
                const power = Math.min(direction.magnitude() * 0.012, MAX_VELOCITY); // Reduced from 0.02 to 0.012 for even more sensitive control
                const velocity = direction.normalize().multiply(power);
                
                this.shootBall(velocity);
            }
        } else if (this.isBuilding) {
            this.isBuilding = false;
            this.placeBuilding();
        } else if (this.isMovingBuilding) {
            this.isMovingBuilding = false;
            this.movingBuilding = null;
            this.movingBuildingOffset = new Vector2D(0, 0);
        }
    }

    handleClick(e) {
        // Removed old single-click wall placement functionality
        // Now only drag-to-place is supported
    }

    placeWall(x, y) {
        // Removed old single-click wall placement functionality
        // Now only drag-to-place is supported
    }

    wallsIntersect(wall1, wall2) {
        return !(wall1.x + wall1.width < wall2.x || 
                wall2.x + wall2.width < wall1.x || 
                wall1.y + wall1.height < wall2.y || 
                wall2.y + wall2.height < wall1.y);
    }

    wallIntersectsBall(wall, ball) {
        const closestX = Math.max(wall.x, Math.min(ball.position.x, wall.x + wall.width));
        const closestY = Math.max(wall.y, Math.min(ball.position.y, wall.y + wall.height));
        
        const distanceX = ball.position.x - closestX;
        const distanceY = ball.position.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    wallIntersectsHole(wall, hole) {
        const closestX = Math.max(wall.x, Math.min(hole.position.x, wall.x + wall.width));
        const closestY = Math.max(wall.y, Math.min(hole.position.y, wall.y + wall.height));
        
        const distanceX = hole.position.x - closestX;
        const distanceY = hole.position.y - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (hole.radius * hole.radius);
    }

    holeOverlapsBall(holePos, ball) {
        const distance = holePos.distance(ball.position);
        return distance < (this.hole.radius + ball.radius);
    }

    holeOverlapsBuildings(holePos) {
        // Check if hole would overlap with any buildings
        for (let building of this.walls) {
            const holeLeft = holePos.x - this.hole.radius;
            const holeRight = holePos.x + this.hole.radius;
            const holeTop = holePos.y - this.hole.radius;
            const holeBottom = holePos.y + this.hole.radius;
            
            const buildingLeft = building.x;
            const buildingRight = building.x + building.width;
            const buildingTop = building.y;
            const buildingBottom = building.y + building.height;
            
            // Check if rectangles overlap
            if (!(buildingRight < holeLeft || 
                  buildingLeft > holeRight || 
                  buildingBottom < holeTop || 
                  buildingTop > holeBottom)) {
                return true;
            }
        }
        return false;
    }

    ballOverlapsHole(ballPos, hole) {
        const distance = ballPos.distance(hole.position);
        return distance < (ball.radius + hole.radius);
    }

    shootBall(velocity) {
        this.ball.velocity = velocity;
        this.ball.isMoving = true;
        
        // Determine which player is shooting based on ball color
        let shootingPlayer;
        if (this.ball.color === '#4169E1') {
            // Blue ball = Player 1
            shootingPlayer = 1;
        } else if (this.ball.color === '#DC143C') {
            // Red ball = Player 2
            shootingPlayer = 2;
        } else {
            // Fallback to current player if color is unexpected
            shootingPlayer = this.currentPlayer;
        }
        
        // Increment shot counter for the correct player
        if (shootingPlayer === 1) {
            this.player1HoleScore++;
        } else {
            this.player2HoleScore++;
        }
        
        this.updateUI();
    }

    checkCollisions() {
        // Skip collision detection in build mode to prevent ball movement
        if (this.currentPhase === PHASES.DESIGN) {
            return;
        }
        
        // Track if ball is on any terrain
        let ballOnTerrain = false;
        
        // Check boundary collisions with improved detection
        for (let wall of this.boundaryWalls) {
            if (wall.intersects(this.ball)) {
                this.resolveCollision(wall);
            }
        }
        
        // Check building collisions (walls, sand, tall grass, water, and ice)
        for (let building of this.walls) {
            if (building.intersects(this.ball)) {
                ballOnTerrain = true;
                if (building.type === 'wall') {
                    this.resolveCollision(building);
                } else if (building.type === 'sand') {
                    this.resolveSandCollision(building);
                } else if (building.type === 'tallGrass') {
                    this.resolveTallGrassCollision(building);
                } else if (building.type === 'water') {
                    this.resolveWaterCollision(building);
                } else if (building.type === 'ice') {
                    this.resolveIceCollision(building);
                }
            }
        }
        
        // Reset to normal friction if not on any terrain
        if (!ballOnTerrain) {
            this.ball.currentFriction = FRICTION;
        }
        
        // Check hole collision
        if (this.hole.contains(this.ball)) {
            this.ballInHole();
        }

        // Check if ball is out of bounds
        if (this.ball.isOutOfBounds() && !this.ball.isInHole) {
            this.ball.respawn();
            this.showMessage("Ball out of bounds! Respawned.");
        }
    }

    // Method for checking collisions during sub-stepping (without hole collision to prevent premature scoring)
    checkCollisionsForStep() {
        // Skip collision detection in build mode to prevent ball movement
        if (this.currentPhase === PHASES.DESIGN) {
            return;
        }
        
        // Track if ball is on any terrain
        let ballOnTerrain = false;
        
        // Check boundary collisions with improved detection
        for (let wall of this.boundaryWalls) {
            if (wall.intersects(this.ball)) {
                this.resolveCollision(wall);
            }
        }
        
        // Check building collisions (walls, sand, tall grass, water, and ice)
        for (let building of this.walls) {
            if (building.intersects(this.ball)) {
                ballOnTerrain = true;
                if (building.type === 'wall') {
                    this.resolveCollision(building);
                } else if (building.type === 'sand') {
                    this.resolveSandCollision(building);
                } else if (building.type === 'tallGrass') {
                    this.resolveTallGrassCollision(building);
                } else if (building.type === 'water') {
                    this.resolveWaterCollision(building);
                } else if (building.type === 'ice') {
                    this.resolveIceCollision(building);
                }
            }
        }
        
        // Reset to normal friction if not on any terrain
        if (!ballOnTerrain) {
            this.ball.currentFriction = FRICTION;
        }

        // Check if ball is out of bounds
        if (this.ball.isOutOfBounds() && !this.ball.isInHole) {
            this.ball.respawn();
            this.showMessage("Ball out of bounds! Respawned.");
        }
    }

    resolveCollision(wall) {
        // Improved collision resolution with proper velocity reflection
        const ballCenter = this.ball.position;
        const closestPoint = wall.getClosestPoint(this.ball);
        
        // Calculate distance to closest point
        const distanceX = ballCenter.x - closestPoint.x;
        const distanceY = ballCenter.y - closestPoint.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Move ball out of wall with proper positioning
        if (distance < this.ball.radius) {
            const overlap = this.ball.radius - distance;
            const moveX = (distanceX / distance) * overlap;
            const moveY = (distanceY / distance) * overlap;
            
            this.ball.position.x += moveX;
            this.ball.position.y += moveY;
            
            // Calculate normal vector from wall to ball
            const normal = new Vector2D(distanceX / distance, distanceY / distance);
            
            // Reflect velocity using the normal vector (0.8x return velocity)
            const dotProduct = this.ball.velocity.x * normal.x + this.ball.velocity.y * normal.y;
            this.ball.velocity.x = this.ball.velocity.x - 2 * dotProduct * normal.x;
            this.ball.velocity.y = this.ball.velocity.y - 2 * dotProduct * normal.y;
            
            // Apply 0.8x velocity reduction
            this.ball.velocity = this.ball.velocity.multiply(0.8);
        }
    }

    resolveSandCollision(sand) {
        // Sand slows the ball down significantly - set friction instead of applying it
        this.ball.currentFriction = SAND_FRICTION;
        
        // Add some drag effect
        if (this.ball.velocity.magnitude() < MIN_VELOCITY) {
            this.ball.velocity = new Vector2D(0, 0);
            this.ball.isMoving = false;
        }
    }

    resolveTallGrassCollision(tallGrass) {
        // Tall grass slows the ball down moderately - set friction instead of applying it
        this.ball.currentFriction = TALL_GRASS_FRICTION;
        
        // Add some drag effect
        if (this.ball.velocity.magnitude() < MIN_VELOCITY) {
            this.ball.velocity = new Vector2D(0, 0);
            this.ball.isMoving = false;
        }
    }

    resolveWaterCollision(water) {
        // Check if more than 50% of the ball is over water
        const ballCenter = this.ball.position;
        
        // Calculate how much of the ball is over water
        const ballLeft = ballCenter.x - this.ball.radius;
        const ballRight = ballCenter.x + this.ball.radius;
        const ballTop = ballCenter.y - this.ball.radius;
        const ballBottom = ballCenter.y + this.ball.radius;
        
        const waterLeft = water.x;
        const waterRight = water.x + water.width;
        const waterTop = water.y;
        const waterBottom = water.y + water.height;
        
        // Calculate overlap area
        const overlapLeft = Math.max(ballLeft, waterLeft);
        const overlapRight = Math.min(ballRight, waterRight);
        const overlapTop = Math.max(ballTop, waterTop);
        const overlapBottom = Math.min(ballBottom, waterBottom);
        
        if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
            const overlapArea = (overlapRight - overlapLeft) * (overlapBottom - overlapTop);
            const ballArea = Math.PI * this.ball.radius * this.ball.radius;
            const overlapPercentage = overlapArea / ballArea;
            
            // If more than 50% of ball is over water, return to last stationary position
            if (overlapPercentage > 0.5) {
                this.ball.position = new Vector2D(this.ball.lastStationaryPosition.x, this.ball.lastStationaryPosition.y);
                this.ball.velocity = new Vector2D(0, 0);
                this.ball.isMoving = false;
                this.ball.currentFriction = FRICTION; // Reset to normal friction
                this.showMessage("Ball went in water! Returned to last position.");
            }
        }
    }

    resolveIceCollision(ice) {
        // Ice has perfect friction - no velocity reduction
        this.ball.currentFriction = ICE_FRICTION;
    }

    ballInHole() {
        // Check if ball is more than half in the hole and hasn't been processed yet
        if (this.hole.isBallHalfIn(this.ball) && !this.ball.isInHole) {
            // Ball went in the hole
            this.ball.isInHole = true;
            this.ball.isMoving = false;
            this.ball.velocity = new Vector2D(0, 0);
            
            // Create confetti
            this.createConfetti();
            
            // Determine which player just completed the hole
            let completingPlayer;
            if (this.player1HoleScore > 0 && this.player2HoleScore === 0) {
                // Player 1 just completed the hole
                completingPlayer = 1;
            } else if (this.player1HoleScore === 0 && this.player2HoleScore > 0) {
                // Player 2 just completed the hole
                completingPlayer = 2;
            } else {
                // Both players have played, this shouldn't happen in normal flow
                completingPlayer = this.currentPlayer;
            }
            
            const completingPlayerName = this.getPlayerColor(completingPlayer);
            const shots = completingPlayer === 1 ? this.player1HoleScore : this.player2HoleScore;
            
            // Check if both players have completed the hole
            if (this.player1HoleScore > 0 && this.player2HoleScore > 0) {
                this.showMessage(`Hole ${this.currentHole} complete!`);
                // Automatically move to next hole after confetti and delay
                setTimeout(() => {
                    this.nextPhase();
                }, 2000); // Increased delay to allow confetti to show
            } else {
                // First player completed, now second player gets their turn
                const nextPlayer = completingPlayer === 1 ? 2 : 1;
                const nextPlayerName = this.getPlayerColor(nextPlayer);
                this.showMessage(`Player ${completingPlayer} (${completingPlayerName}) completed hole ${this.currentHole}. Now Player ${nextPlayer} (${nextPlayerName}) gets their turn.`);
                
                // Spawn the next player's ball after confetti and delay
                setTimeout(() => {
                    this.ball.reset(this.spawnPosition.x, this.spawnPosition.y);
                    this.updateBallColor();
                    this.showMessage(`Player ${nextPlayer} (${nextPlayerName}) is now playing.`);
                }, 2000); // Increased delay to allow confetti to show
            }
        }
    }

    updateUI() {
        // Debug: Check if elements exist
        const player1HoleScoreEl = document.getElementById('player1-hole-score');
        const player2HoleScoreEl = document.getElementById('player2-hole-score');
        const player1TotalScoreEl = document.getElementById('player1-total-score');
        const player2TotalScoreEl = document.getElementById('player2-total-score');
        const currentHoleEl = document.getElementById('current-hole');
        const totalHolesEl = document.getElementById('total-holes');
        
        // Check each element individually
        if (!currentHoleEl) console.error('current-hole element not found');
        if (!totalHolesEl) console.error('total-holes element not found');
        if (!player1HoleScoreEl) console.error('player1-hole-score element not found');
        if (!player2HoleScoreEl) console.error('player2-hole-score element not found');
        if (!player1TotalScoreEl) console.error('player1-total-score element not found');
        if (!player2TotalScoreEl) console.error('player2-total-score element not found');
        
        // Only update elements that exist
        if (currentHoleEl) currentHoleEl.textContent = this.currentHole;
        if (totalHolesEl) totalHolesEl.textContent = this.totalHoles;
        if (player1HoleScoreEl) player1HoleScoreEl.textContent = this.player1HoleScore;
        if (player2HoleScoreEl) player2HoleScoreEl.textContent = this.player2HoleScore;
        
        // Calculate and update total scores
        const player1Total = this.player1Score + this.player1HoleScore;
        const player2Total = this.player2Score + this.player2HoleScore;
        if (player1TotalScoreEl) player1TotalScoreEl.textContent = player1Total;
        if (player2TotalScoreEl) player2TotalScoreEl.textContent = player2Total;
        
        console.log('updateUI called:', {
            player1HoleScore: this.player1HoleScore,
            player2HoleScore: this.player2HoleScore,
            player1Total: player1Total,
            player2Total: player2Total
        });
    }

    updateBallColor() {
        if (this.currentPhase === PHASES.PLAY) {
            // Determine which player is currently playing based on scores
            let playingPlayer;
            if (this.player1HoleScore === 0 && this.player2HoleScore === 0) {
                // No one has completed yet, so the designer plays first
                playingPlayer = this.currentPlayer;
            } else if (this.player1HoleScore > 0 && this.player2HoleScore === 0) {
                // Player 1 has completed, so Player 2 is playing now
                playingPlayer = 2;
            } else if (this.player1HoleScore === 0 && this.player2HoleScore > 0) {
                // Player 2 has completed, so Player 1 is playing now
                playingPlayer = 1;
            } else {
                // Both have completed, use current player
                playingPlayer = this.currentPlayer;
            }
            
            this.ball.color = playingPlayer === 1 ? '#4169E1' : '#DC143C';
        }
    }

    showMessage(text) {
        const messageEl = document.getElementById('message');
        if (messageEl) {
            messageEl.textContent = text;
        }
    }

    getPlayerColor(player) {
        return player === 1 ? 'Blue' : 'Red';
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#a2d149';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw boundary walls
        for (let wall of this.boundaryWalls) {
            wall.draw(this.ctx);
        }
        
        // Draw placed buildings (walls and water)
        for (let building of this.walls) {
            building.draw(this.ctx);
            
            // Draw selection highlight if this building is selected
            if (building === this.selectedBuilding) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(building.x - 2, building.y - 2, building.width + 4, building.height + 4);
            }
        }
        
        // Draw building preview if building
        if (this.isBuilding && this.currentPhase === PHASES.DESIGN) {
            this.drawBuildingPreview();
        }
        
        // Draw hole
        this.hole.draw(this.ctx);
        
        // Draw ball (only if not in hole)
        this.ball.draw(this.ctx);
        
        // Draw confetti
        this.drawConfetti();
        
        // Draw trajectory if dragging (draw last to ensure it's on top)
        if (this.showTrajectory && this.isDragging) {
            this.drawTrajectory();
        }
    }

    drawBuildingPreview() {
        const startX = Math.min(this.buildStart.x, this.buildEnd.x);
        const startY = Math.min(this.buildStart.y, this.buildEnd.y);
        const endX = Math.max(this.buildStart.x, this.buildEnd.x);
        const endY = Math.max(this.buildStart.y, this.buildEnd.y);
        
        const width = endX - startX;
        const height = endY - startY;
        
        if (width < 10 || height < 10) return;
        
        // Draw preview with transparency
        this.ctx.globalAlpha = 0.6;
        
        if (this.currentBuildingType === 'wall') {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(startX, startY, width, height);
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'sand') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            gradient.addColorStop(0, '#F4D03F');
            gradient.addColorStop(0.5, '#F7DC6F');
            gradient.addColorStop(1, '#F8C471');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'tallGrass') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            gradient.addColorStop(0, '#2E8B57');
            gradient.addColorStop(0.5, '#3CB371');
            gradient.addColorStop(1, '#228B22');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'water') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            gradient.addColorStop(0, '#1E90FF');
            gradient.addColorStop(0.5, '#00BFFF');
            gradient.addColorStop(1, '#87CEEB');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'ice') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            gradient.addColorStop(0, '#E0F6FF');
            gradient.addColorStop(0.5, '#F0F8FF');
            gradient.addColorStop(1, '#E6F3FF');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(startX, startY, width, height);
        }
        
        this.ctx.globalAlpha = 1.0;
    }

    drawTrajectory() {
        const direction = this.dragStart.subtract(this.dragEnd);
        const power = Math.min(direction.magnitude() * 0.012, MAX_VELOCITY); // Updated to match new power calculation
        
        if (power > MIN_VELOCITY) {
            // Calculate the direction behind the ball (opposite of where it will shoot)
            const behindDirection = direction.normalize();
            
            // Calculate line length based on power (longer line = more power)
            const maxLineLength = 80; // Maximum length of the dot line
            const lineLength = Math.min((power / MAX_VELOCITY) * maxLineLength, maxLineLength);
            
            // Number of dots based on line length
            const numDots = Math.floor(lineLength / 8) + 1; // One dot every 8 pixels
            
            // Save context state
            this.ctx.save();
            
            // Set blend mode to ensure dots are visible
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.globalAlpha = 1.0;
            
            // Draw dots behind the ball
            for (let i = 0; i < numDots; i++) {
                const distance = (i / (numDots - 1)) * lineLength;
                const dotX = this.ball.position.x - behindDirection.x * distance;
                const dotY = this.ball.position.y - behindDirection.y * distance;
                
                // Dot size gets larger as it gets further from the ball (inverse)
                const dotSize = Math.max(2, 2 + (i * 0.8));
                
                this.ctx.beginPath();
                this.ctx.arc(dotX, dotY, dotSize, 0, 2 * Math.PI);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fill();
                this.ctx.strokeStyle = '#CCCCCC';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
            
            // Restore context state
            this.ctx.restore();
            
            // Show power level number only in dev mode
            if (this.devMode) {
                this.ctx.fillStyle = '#FF0000';
                this.ctx.font = '20px Arial';
                this.ctx.fillText(`Power Level: ${Math.round(power * 100)}`, 10, 30);
            }
        }
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.currentState !== GAME_STATES.START && this.currentState !== GAME_STATES.WIN) {
            // Update ball physics
            this.ball.update(deltaTime, this);
            
            // Check collisions
            this.checkCollisions();
        }
        
        // Update confetti
        this.updateConfetti();
        
        // Draw everything
        this.draw();
        
        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    createConfetti() {
        this.showConfetti = true;
        this.confettiStartTime = Date.now();
        this.confetti = [];
        
        // Create confetti particles above the hole
        for (let i = 0; i < 30; i++) {
            this.confetti.push({
                x: this.hole.position.x + (Math.random() - 0.5) * 40, // Spread around hole
                y: this.hole.position.y - 20 - Math.random() * 30, // Above hole
                vx: (Math.random() - 0.5) * 4, // Random horizontal velocity
                vy: -Math.random() * 3 - 1, // Upward velocity
                color: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#32CD32'][Math.floor(Math.random() * 6)],
                size: Math.random() * 4 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
    }

    updateConfetti() {
        if (!this.showConfetti) return;
        
        // Update confetti particles
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            const particle = this.confetti[i];
            
            // Apply gravity
            particle.vy += 0.1;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed;
            
            // Remove particles that are off screen or have fallen too far
            if (particle.y > CANVAS_HEIGHT + 50 || particle.x < -50 || particle.x > CANVAS_WIDTH + 50) {
                this.confetti.splice(i, 1);
            }
        }
        
        // Stop confetti after 2 seconds
        if (Date.now() - this.confettiStartTime > 2000) {
            this.showConfetti = false;
            this.confetti = [];
        }
    }

    drawConfetti() {
        if (!this.showConfetti) return;
        
        for (const particle of this.confetti) {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            
            // Draw confetti piece
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            
            this.ctx.restore();
        }
    }

    undoLastBuilding() {
        if (this.buildingHistory.length > 0) {
            const lastBuilding = this.buildingHistory.pop();
            
            // Remove the building from the walls array
            const index = this.walls.findIndex(building => 
                building.x === lastBuilding.x && 
                building.y === lastBuilding.y && 
                building.width === lastBuilding.width && 
                building.height === lastBuilding.height &&
                building.type === lastBuilding.type
            );
            
            if (index !== -1) {
                this.walls.splice(index, 1);
            }
        }
    }

    selectBuildingType(type) {
        this.currentBuildingType = type;
        
        // Update UI to show selected building type
        const wallOption = document.getElementById('wall-option');
        const sandOption = document.getElementById('sand-option');
        const tallGrassOption = document.getElementById('tall-grass-option');
        const waterOption = document.getElementById('water-option');
        const iceOption = document.getElementById('ice-option');
        
        if (wallOption && sandOption && tallGrassOption && waterOption && iceOption) {
            wallOption.classList.remove('active');
            sandOption.classList.remove('active');
            tallGrassOption.classList.remove('active');
            waterOption.classList.remove('active');
            iceOption.classList.remove('active');
            
            if (type === 'wall') {
                wallOption.classList.add('active');
            } else if (type === 'sand') {
                sandOption.classList.add('active');
            } else if (type === 'tallGrass') {
                tallGrassOption.classList.add('active');
            } else if (type === 'water') {
                waterOption.classList.add('active');
            } else if (type === 'ice') {
                iceOption.classList.add('active');
            }
        }
    }

    placeBuilding() {
        // Calculate building dimensions
        const startX = Math.min(this.buildStart.x, this.buildEnd.x);
        const startY = Math.min(this.buildStart.y, this.buildEnd.y);
        const endX = Math.max(this.buildStart.x, this.buildEnd.x);
        const endY = Math.max(this.buildStart.y, this.buildEnd.y);
        
        const width = endX - startX;
        const height = endY - startY;
        
        // Only place if the building is large enough and within boundaries
        if (width < 10 || height < 10 || !this.isWithinBoundaries(startX, startY, width, height)) return;
        
        let newBuilding;
        
        if (this.currentBuildingType === 'wall') {
            newBuilding = new Wall(startX, startY, width, height);
        } else if (this.currentBuildingType === 'sand') {
            newBuilding = new Sand(startX, startY, width, height);
        } else if (this.currentBuildingType === 'tallGrass') {
            newBuilding = new TallGrass(startX, startY, width, height);
        } else if (this.currentBuildingType === 'water') {
            newBuilding = new Water(startX, startY, width, height);
        } else if (this.currentBuildingType === 'ice') {
            newBuilding = new Ice(startX, startY, width, height);
        }
        
        if (newBuilding) {
            // Check for collisions
            if (!this.buildingIntersectsObjects(newBuilding)) {
                this.walls.push(newBuilding);
                this.buildingHistory.push(newBuilding);
            }
        }
    }

    buildingIntersectsObjects(building) {
        // Check collision with ball (center of ball must not be inside building)
        if (
            building.x < this.ball.position.x + this.ball.radius &&
            building.x + building.width > this.ball.position.x - this.ball.radius &&
            building.y < this.ball.position.y + this.ball.radius &&
            building.y + building.height > this.ball.position.y - this.ball.radius
        ) {
            return true;
        }
        
        // Check collision with hole - improved detection
        // Check if any part of the building overlaps with the hole area
        const holeLeft = this.hole.position.x - this.hole.radius;
        const holeRight = this.hole.position.x + this.hole.radius;
        const holeTop = this.hole.position.y - this.hole.radius;
        const holeBottom = this.hole.position.y + this.hole.radius;
        
        const buildingLeft = building.x;
        const buildingRight = building.x + building.width;
        const buildingTop = building.y;
        const buildingBottom = building.y + building.height;
        
        // Check if rectangles overlap
        if (!(buildingRight < holeLeft || 
              buildingLeft > holeRight || 
              buildingBottom < holeTop || 
              buildingTop > holeBottom)) {
            return true;
        }
        
        // Check collision with existing buildings (excluding the one being moved)
        for (let existingBuilding of this.walls) {
            if (existingBuilding !== this.movingBuilding && this.buildingsIntersect(building, existingBuilding)) {
                return true;
            }
        }
        
        return false;
    }

    buildingsIntersect(building1, building2) {
        return !(building1.x + building1.width < building2.x || 
                building2.x + building2.width < building1.x || 
                building1.y + building1.height < building2.y || 
                building2.y + building2.height < building1.y);
    }

    getBuildingAtPosition(x, y) {
        for (let building of this.walls) {
            if (building.x <= x && building.x + building.width >= x &&
                building.y <= y && building.y + building.height >= y) {
                return building;
            }
        }
        return null;
    }

    deleteSelectedBuilding() {
        if (this.selectedBuilding) {
            // Remove the building from the walls array
            const index = this.walls.findIndex(building => 
                building.x === this.selectedBuilding.x && 
                building.y === this.selectedBuilding.y && 
                building.width === this.selectedBuilding.width && 
                building.height === this.selectedBuilding.height &&
                building.type === this.selectedBuilding.type
            );
            
            if (index !== -1) {
                this.walls.splice(index, 1);
            }
            
            // Reset selected building
            this.selectedBuilding = null;
        }
    }

    isWithinBoundaries(x, y, width = 0, height = 0) {
        // Account for boundary wall thickness
        return (
            x >= WALL_THICKNESS &&
            y >= WALL_THICKNESS &&
            x + width <= CANVAS_WIDTH - WALL_THICKNESS &&
            y + height <= CANVAS_HEIGHT - WALL_THICKNESS
        );
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GolfGame();
}); 