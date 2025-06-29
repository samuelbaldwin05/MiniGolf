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
const ICE_FRICTION = 0.995;
const WATER_FRICTION = 0.8;

// Premade course data
const PREMADE_COURSES = {
    beginner: {
        name: "Beginner Course",
        holes: 3,
        courses: [
            {
                name: "Hole 1",
                ballPosition: { x: 91, y: 201 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'wall', x: 200, y: 200, width: 420, height: 10, rotation: 0 },
                    { type: 'ice', x: 160, y: 210, width: 525, height: 180, rotation: 0 },
                    { type: 'water', x: 685, y: 225, width: 105, height: 163, rotation: 0 },
                    { type: 'tallGrass', x: 160, y: 12, width: 525, height: 190, rotation: 0 },
                    { type: 'sand', x: 685, y: 15, width: 105, height: 163, rotation: 0 }
                ]
            },
            {
                name: "Hole 2",
                ballPosition: { x: 88, y: 75 },
                holePosition: { x: 718, y: 67 },
                walls: [
                    { type: 'wall', x: 127, y: 12, width: 11, height: 265, rotation: 0 },
                    { type: 'wall', x: 287, y: 200, width: 12, height: 187, rotation: -142.15182766164443 },
                    { type: 'wall', x: 231, y: 375, width: 13, height: 13, rotation: 0 },
                    { type: 'sand', x: 12, y: 364, width: 222, height: 24, rotation: 0 },
                    { type: 'tallGrass', x: 134, y: 11, width: 377, height: 108, rotation: 0 },
                    { type: 'wall', x: 322, y: 120, width: 189, height: 12, rotation: 0 },
                    { type: 'water', x: 366, y: 221, width: 422, height: 167, rotation: 0 },
                    { type: 'wall', x: 356, y: 204, width: 14, height: 185, rotation: 0 }
                ]
            },
            {
                name: "Hole 3",
                ballPosition: { x: 48, y: 289 },
                holePosition: { x: 664, y: 270 },
                walls: [
                    { type: 'wall', x: 367, y: 90, width: 15, height: 298, rotation: 0 },
                    { type: 'tallGrass', x: 148, y: 212, width: 475, height: 177, rotation: 0 },
                    { type: 'wall', x: 41, y: 86, width: 218, height: 12, rotation: 0 },
                    { type: 'ice', x: 40, y: 11, width: 220, height: 74, rotation: 0 },
                    { type: 'sand', x: 40, y: 98, width: 223, height: 34, rotation: 0 },
                    { type: 'water', x: 618, y: 321, width: 170, height: 68, rotation: 0 },
                    { type: 'water', x: 717, y: 209, width: 73, height: 127, rotation: 0 },
                    { type: 'wall', x: 507, y: 45, width: 283, height: 12, rotation: 16.891695744674493 }
                ]
            }
        ]
    },
    intermediate: {
        name: "Intermediate Course",
        holes: 5,
        courses: [
            {
                name: "Hole 1",
                ballPosition: { x: 324, y: 304 },   
                holePosition: { x: 692, y: 95 },
                walls: [
                    { type: "wall", x: 542, y: 32, width: 184, height: 13, rotation: -165.5559642755078 },
                    { type: "wall", x: 747, y: 56, width: 14, height: 176, rotation: -18.621579366487577 },
                    { type: "sand", x: 424, y: 215, width: 364, height: 174, rotation: 0 },
                    { type: "wall", x: 409, y: 214, width: 14, height: 175, rotation: 0 },
                    { type: "tallGrass", x: 11, y: 11, width: 261, height: 140, rotation: 0 },
                    { type: "wall", x: 273, y: 10, width: 125, height: 174, rotation: 0 }
                ]
            },
            {
                name: "Hole 2",
                ballPosition: { x: 50, y: 150 },
                holePosition: { x: 750, y: 250 },
                walls: [
                    { type: 'wall', x: 200, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'wall', x: 400, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'wall', x: 600, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'sand', x: 300, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'tallGrass', x: 500, y: 150, width: 80, height: 100, rotation: 0 }
                ]
            },
            {
                name: "Hole 3",
                ballPosition: { x: 50, y: 200 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'wall', x: 300, y: 150, width: 20, height: 100, rotation: 45 },
                    { type: 'water', x: 400, y: 150, width: 100, height: 100, rotation: 0 },
                    { type: 'ice', x: 550, y: 180, width: 60, height: 40, rotation: 0 }
                ]
            },
            {
                name: "Hole 4",
                ballPosition: { x: 50, y: 100 },
                holePosition: { x: 750, y: 300 },
                walls: [
                    { type: 'wall', x: 200, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'wall', x: 400, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'wall', x: 600, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'sand', x: 250, y: 150, width: 120, height: 100, rotation: 0 },
                    { type: 'tallGrass', x: 450, y: 150, width: 120, height: 100, rotation: 0 }
                ]
            },
            {
                name: "Hole 5",
                ballPosition: { x: 50, y: 200 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'wall', x: 250, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'wall', x: 450, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'water', x: 350, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'ice', x: 550, y: 180, width: 60, height: 40, rotation: 0 },
                    { type: 'sand', x: 650, y: 150, width: 60, height: 100, rotation: 0 }
                ]
            }
        ]
    },
    advanced: {
        name: "Advanced Course",
        holes: 7,
        courses: [
            {
                name: "Hole 1",
                ballPosition: { x: 50, y: 200 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'wall', x: 200, y: 150, width: 20, height: 100, rotation: 0 },
                    { type: 'wall', x: 400, y: 150, width: 20, height: 100, rotation: 0 },
                    { type: 'wall', x: 600, y: 150, width: 20, height: 100, rotation: 0 },
                    { type: 'water', x: 300, y: 180, width: 80, height: 40, rotation: 0 },
                    { type: 'sand', x: 500, y: 180, width: 80, height: 40, rotation: 0 }
                ]
            },
            {
                name: "Hole 2",
                ballPosition: { x: 50, y: 100 },
                holePosition: { x: 750, y: 300 },
                walls: [
                    { type: 'wall', x: 250, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'wall', x: 450, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'water', x: 350, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'ice', x: 550, y: 200, width: 60, height: 40, rotation: 0 }
                ]
            },
            {
                name: "Hole 3",
                ballPosition: { x: 50, y: 200 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'wall', x: 300, y: 150, width: 20, height: 100, rotation: 30 },
                    { type: 'wall', x: 500, y: 150, width: 20, height: 100, rotation: -30 },
                    { type: 'water', x: 400, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'sand', x: 600, y: 180, width: 60, height: 40, rotation: 0 }
                ]
            },
            {
                name: "Hole 4",
                ballPosition: { x: 50, y: 150 },
                holePosition: { x: 750, y: 250 },
                walls: [
                    { type: 'wall', x: 200, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'wall', x: 400, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'wall', x: 600, y: 100, width: 20, height: 200, rotation: 0 },
                    { type: 'tallGrass', x: 300, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'ice', x: 500, y: 150, width: 80, height: 100, rotation: 0 }
                ]
            },
            {
                name: "Hole 5",
                ballPosition: { x: 50, y: 200 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'wall', x: 250, y: 150, width: 20, height: 100, rotation: 45 },
                    { type: 'wall', x: 450, y: 150, width: 20, height: 100, rotation: -45 },
                    { type: 'water', x: 350, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'sand', x: 550, y: 180, width: 60, height: 40, rotation: 0 }
                ]
            },
            {
                name: "Hole 6",
                ballPosition: { x: 50, y: 100 },
                holePosition: { x: 750, y: 300 },
                walls: [
                    { type: 'wall', x: 200, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'wall', x: 400, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'wall', x: 600, y: 50, width: 20, height: 300, rotation: 0 },
                    { type: 'water', x: 300, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'tallGrass', x: 500, y: 150, width: 80, height: 100, rotation: 0 },
                    { type: 'ice', x: 650, y: 200, width: 60, height: 40, rotation: 0 }
                ]
            },
            {
                name: "Hole 7",
                ballPosition: { x: 50, y: 200 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'wall', x: 200, y: 150, width: 20, height: 100, rotation: 0 },
                    { type: 'wall', x: 400, y: 150, width: 20, height: 100, rotation: 0 },
                    { type: 'wall', x: 600, y: 150, width: 20, height: 100, rotation: 0 },
                    { type: 'water', x: 300, y: 180, width: 80, height: 40, rotation: 0 },
                    { type: 'sand', x: 500, y: 180, width: 80, height: 40, rotation: 0 },
                    { type: 'tallGrass', x: 650, y: 150, width: 60, height: 100, rotation: 0 }
                ]
            }
        ]
    }
};

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
        this.isWaitingForWaterCheck = false; // New property to track water check waiting state
        this.initialPosition = new Vector2D(x, y); // Store initial position for respawning
        this.lastPosition = new Vector2D(x, y); // Store last position for water hazards
        this.lastStationaryPosition = new Vector2D(x, y); // Store last position when ball stopped moving
        this.endPosition = new Vector2D(x, y); // Store where the ball ends up after each shot
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
                
                // Check if ball stopped over water immediately
                if (gameInstance) {
                    const waterCheck = gameInstance.checkIfBallOverWater();
                    if (waterCheck.isOverWater) {
                        // Ball stopped over water - move it back to previous position
                        this.position = new Vector2D(this.endPosition.x, this.endPosition.y);
                        gameInstance.showMessage("Ball went in water! Returning to previous position.");
                    } else {
                        // Ball stopped in a safe position - update end position
                        this.endPosition = new Vector2D(this.position.x, this.position.y);
                    }
                    this.isWaitingForWaterCheck = false; // Clear waiting flag after water check
                } else {
                    // No game instance - just update end position
                    this.endPosition = new Vector2D(this.position.x, this.position.y);
                }
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
        this.endPosition = new Vector2D(x, y); // Reset end position to spawn
        this.velocity = new Vector2D(0, 0);
        this.isMoving = false;
        this.isInHole = false;
        this.isWaitingForWaterCheck = false; // Clear waiting flag
        this.currentFriction = FRICTION; // Reset to normal friction
    }

    respawn() {
        this.position = new Vector2D(this.initialPosition.x, this.initialPosition.y);
        this.endPosition = new Vector2D(this.initialPosition.x, this.initialPosition.y); // Reset end position to initial
        this.velocity = new Vector2D(0, 0);
        this.isMoving = false;
        this.isInHole = false;
        this.isWaitingForWaterCheck = false; // Clear waiting flag
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
        // Skip collision detection in build mode to prevent ball movement
        if (this.currentPhase === PHASES.DESIGN) {
            return;
        }
        
        // Check boundary collisions with improved detection
        for (let wall of this.boundaryWalls) {
            if (wall.intersects(this.ball)) {
                this.resolveCollision(wall);
            }
        }
        
        // Check building collisions - only check the topmost building at each position (same as main checkCollisions)
        let topmostBuilding = null;
        let highestZIndex = -1;
        
        for (let building of this.walls) {
            if (building.intersects(this.ball)) {
                if (building.zIndex > highestZIndex) {
                    highestZIndex = building.zIndex;
                    topmostBuilding = building;
                }
            }
        }
        
        // Only resolve collision with the topmost building
        if (topmostBuilding) {
            if (topmostBuilding.type === 'wall') {
                this.resolveCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'sand') {
                this.resolveSandCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'tallGrass') {
                this.resolveTallGrassCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'water') {
                this.resolveWaterCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'ice') {
                this.resolveIceCollision(topmostBuilding);
            }
        } else {
            // Reset to normal friction if not on any terrain
            this.ball.currentFriction = FRICTION;
        }

        // Check if ball is out of bounds
        if (this.ball.isOutOfBounds() && !this.ball.isInHole) {
            this.ball.respawn();
            this.showMessage("Ball out of bounds! Respawned.");
        }
    }
}

class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'wall';
        this.rotation = 0; // Add rotation property
        this.hitboxPadding = 3; // Padding for collision detection
        this.zIndex = 0; // Add zIndex for layering
    }

    draw(ctx) {
        if (this.rotation !== 0) {
            // Save context state
            ctx.save();
            
            // Move to building center and rotate
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Draw rectangle centered at origin
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Restore context state
            ctx.restore();
        } else {
            // Draw rectangle without rotation
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    intersects(ball) {
        if (this.rotation === 0) {
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
        } else {
            // For rotated walls, use actual rotated rectangle collision
            return this.rotatedRectangleIntersects(ball);
        }
    }

    rotatedRectangleIntersects(ball) {
        // Transform ball position to wall's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to wall center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to wall's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Now check collision with axis-aligned rectangle (with padding)
        const expandedWidth = this.width + 2 * this.hitboxPadding;
        const expandedHeight = this.height + 2 * this.hitboxPadding;
        
        const closestX = Math.max(-expandedWidth / 2, Math.min(rotatedX, expandedWidth / 2));
        const closestY = Math.max(-expandedHeight / 2, Math.min(rotatedY, expandedHeight / 2));
        
        const distanceX = rotatedX - closestX;
        const distanceY = rotatedY - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getBoundingBox() {
        if (this.rotation === 0) {
            return {
                left: this.x - this.hitboxPadding,
                right: this.x + this.width + this.hitboxPadding,
                top: this.y - this.hitboxPadding,
                bottom: this.y + this.height + this.hitboxPadding
            };
        } else {
            // Calculate bounding box for rotated rectangle
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const angle = this.rotation * Math.PI / 180;
            
            // Calculate the four corners of the rotated rectangle
            const corners = [
                { x: -this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: this.height / 2 },
                { x: -this.width / 2, y: this.height / 2 }
            ];
            
            // Rotate and translate corners
            const rotatedCorners = corners.map(corner => {
                const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle);
                const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle);
                return {
                    x: rotatedX + centerX,
                    y: rotatedY + centerY
                };
            });
            
            // Find bounding box
            const xs = rotatedCorners.map(c => c.x);
            const ys = rotatedCorners.map(c => c.y);
            
            return {
                left: Math.min(...xs) - this.hitboxPadding,
                right: Math.max(...xs) + this.hitboxPadding,
                top: Math.min(...ys) - this.hitboxPadding,
                bottom: Math.max(...ys) + this.hitboxPadding
            };
        }
    }

    getClosestPoint(ball) {
        if (this.rotation === 0) {
            const expandedX = this.x - this.hitboxPadding;
            const expandedY = this.y - this.hitboxPadding;
            const expandedWidth = this.width + 2 * this.hitboxPadding;
            const expandedHeight = this.height + 2 * this.hitboxPadding;
            
            const closestX = Math.max(expandedX, Math.min(ball.position.x, expandedX + expandedWidth));
            const closestY = Math.max(expandedY, Math.min(ball.position.y, expandedY + expandedHeight));
            
            return new Vector2D(closestX, closestY);
        } else {
            // For rotated walls, use actual rotated rectangle logic
            return this.rotatedRectangleGetClosestPoint(ball);
        }
    }

    rotatedRectangleGetClosestPoint(ball) {
        // Transform ball position to wall's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to wall center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to wall's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Find closest point on axis-aligned rectangle (with padding)
        const expandedWidth = this.width + 2 * this.hitboxPadding;
        const expandedHeight = this.height + 2 * this.hitboxPadding;
        
        const closestLocalX = Math.max(-expandedWidth / 2, Math.min(rotatedX, expandedWidth / 2));
        const closestLocalY = Math.max(-expandedHeight / 2, Math.min(rotatedY, expandedHeight / 2));
        
        // Transform back to world coordinates
        const angleBack = this.rotation * Math.PI / 180;
        const rotatedBackX = closestLocalX * Math.cos(angleBack) - closestLocalY * Math.sin(angleBack);
        const rotatedBackY = closestLocalX * Math.sin(angleBack) + closestLocalY * Math.cos(angleBack);
        
        return new Vector2D(rotatedBackX + centerX, rotatedBackY + centerY);
    }
}

class Sand {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'sand';
        this.rotation = 0; // Add rotation property
        this.zIndex = 0; // Add zIndex for layering
    }

    draw(ctx) {
        if (this.rotation !== 0) {
            // Save context state
            ctx.save();
            
            // Move to building center and rotate
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Create gradient for sand effect
            const gradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
            gradient.addColorStop(0, '#F4D03F');
            gradient.addColorStop(0.5, '#F7DC6F');
            gradient.addColorStop(1, '#F8C471');
            
            // Draw rectangle centered at origin
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Restore context state
            ctx.restore();
        } else {
            // Create gradient for sand effect
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
            gradient.addColorStop(0, '#F4D03F');
            gradient.addColorStop(0.5, '#F7DC6F');
            gradient.addColorStop(1, '#F8C471');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    intersects(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            const distanceX = ball.position.x - closestX;
            const distanceY = ball.position.y - closestY;
            
            return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
        } else {
            // For rotated sand, use actual rotated rectangle collision
            return this.rotatedRectangleIntersects(ball);
        }
    }

    rotatedRectangleIntersects(ball) {
        // Transform ball position to sand's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to sand center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to sand's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Now check collision with axis-aligned rectangle
        const closestX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        const distanceX = rotatedX - closestX;
        const distanceY = rotatedY - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getBoundingBox() {
        if (this.rotation === 0) {
            return {
                left: this.x,
                right: this.x + this.width,
                top: this.y,
                bottom: this.y + this.height
            };
        } else {
            // Calculate bounding box for rotated rectangle
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const angle = this.rotation * Math.PI / 180;
            
            // Calculate the four corners of the rotated rectangle
            const corners = [
                { x: -this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: this.height / 2 },
                { x: -this.width / 2, y: this.height / 2 }
            ];
            
            // Rotate and translate corners
            const rotatedCorners = corners.map(corner => {
                const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle);
                const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle);
                return {
                    x: rotatedX + centerX,
                    y: rotatedY + centerY
                };
            });
            
            // Find bounding box
            const xs = rotatedCorners.map(c => c.x);
            const ys = rotatedCorners.map(c => c.y);
            
            return {
                left: Math.min(...xs),
                right: Math.max(...xs),
                top: Math.min(...ys),
                bottom: Math.max(...ys)
            };
        }
    }

    getClosestPoint(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            return new Vector2D(closestX, closestY);
        } else {
            // For rotated sand, use actual rotated rectangle logic
            return this.rotatedRectangleGetClosestPoint(ball);
        }
    }

    rotatedRectangleGetClosestPoint(ball) {
        // Transform ball position to sand's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to sand center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to sand's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Find closest point on axis-aligned rectangle
        const closestLocalX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestLocalY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        // Transform back to world coordinates
        const angleBack = this.rotation * Math.PI / 180;
        const rotatedBackX = closestLocalX * Math.cos(angleBack) - closestLocalY * Math.sin(angleBack);
        const rotatedBackY = closestLocalX * Math.sin(angleBack) + closestLocalY * Math.cos(angleBack);
        
        return new Vector2D(rotatedBackX + centerX, rotatedBackY + centerY);
    }
}

class TallGrass {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'tallGrass';
        this.rotation = 0; // Add rotation property
        this.zIndex = 0; // Add zIndex for layering
    }

    draw(ctx) {
        if (this.rotation !== 0) {
            // Save context state
            ctx.save();
            
            // Move to building center and rotate
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Create gradient for tall grass effect
            const gradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
            gradient.addColorStop(0, '#2E8B57');
            gradient.addColorStop(0.5, '#3CB371');
            gradient.addColorStop(1, '#228B22');
            
            // Draw rectangle centered at origin
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Restore context state
            ctx.restore();
        } else {
            // Create gradient for tall grass effect
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
            gradient.addColorStop(0, '#2E8B57');
            gradient.addColorStop(0.5, '#3CB371');
            gradient.addColorStop(1, '#228B22');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    intersects(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            const distanceX = ball.position.x - closestX;
            const distanceY = ball.position.y - closestY;
            
            return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
        } else {
            // For rotated tall grass, use actual rotated rectangle collision
            return this.rotatedRectangleIntersects(ball);
        }
    }

    rotatedRectangleIntersects(ball) {
        // Transform ball position to tall grass's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to tall grass center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to tall grass's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Now check collision with axis-aligned rectangle
        const closestX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        const distanceX = rotatedX - closestX;
        const distanceY = rotatedY - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getBoundingBox() {
        if (this.rotation === 0) {
            return {
                left: this.x,
                right: this.x + this.width,
                top: this.y,
                bottom: this.y + this.height
            };
        } else {
            // Calculate bounding box for rotated rectangle
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const angle = this.rotation * Math.PI / 180;
            
            // Calculate the four corners of the rotated rectangle
            const corners = [
                { x: -this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: this.height / 2 },
                { x: -this.width / 2, y: this.height / 2 }
            ];
            
            // Rotate and translate corners
            const rotatedCorners = corners.map(corner => {
                const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle);
                const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle);
                return {
                    x: rotatedX + centerX,
                    y: rotatedY + centerY
                };
            });
            
            // Find bounding box
            const xs = rotatedCorners.map(c => c.x);
            const ys = rotatedCorners.map(c => c.y);
            
            return {
                left: Math.min(...xs),
                right: Math.max(...xs),
                top: Math.min(...ys),
                bottom: Math.max(...ys)
            };
        }
    }

    getClosestPoint(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            return new Vector2D(closestX, closestY);
        } else {
            // For rotated tall grass, use actual rotated rectangle logic
            return this.rotatedRectangleGetClosestPoint(ball);
        }
    }

    rotatedRectangleGetClosestPoint(ball) {
        // Transform ball position to tall grass's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to tall grass center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to tall grass's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Find closest point on axis-aligned rectangle
        const closestLocalX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestLocalY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        // Transform back to world coordinates
        const angleBack = this.rotation * Math.PI / 180;
        const rotatedBackX = closestLocalX * Math.cos(angleBack) - closestLocalY * Math.sin(angleBack);
        const rotatedBackY = closestLocalX * Math.sin(angleBack) + closestLocalY * Math.cos(angleBack);
        
        return new Vector2D(rotatedBackX + centerX, rotatedBackY + centerY);
    }
}

class Water {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'water';
        this.rotation = 0; // Add rotation property
        this.zIndex = 0; // Add zIndex for layering
    }

    draw(ctx) {
        if (this.rotation !== 0) {
            // Save context state
            ctx.save();
            
            // Move to building center and rotate
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Create gradient for water effect
            const gradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
            gradient.addColorStop(0, '#1E90FF');
            gradient.addColorStop(0.5, '#00BFFF');
            gradient.addColorStop(1, '#87CEEB');
            
            // Draw rectangle centered at origin
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Restore context state
            ctx.restore();
        } else {
            // Create gradient for water effect
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
            gradient.addColorStop(0, '#1E90FF');
            gradient.addColorStop(0.5, '#00BFFF');
            gradient.addColorStop(1, '#87CEEB');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    intersects(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            const distanceX = ball.position.x - closestX;
            const distanceY = ball.position.y - closestY;
            
            return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
        } else {
            // For rotated water, use actual rotated rectangle collision
            return this.rotatedRectangleIntersects(ball);
        }
    }

    rotatedRectangleIntersects(ball) {
        // Transform ball position to water's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to water center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to water's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Now check collision with axis-aligned rectangle
        const closestX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        const distanceX = rotatedX - closestX;
        const distanceY = rotatedY - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getBoundingBox() {
        if (this.rotation === 0) {
            return {
                left: this.x,
                right: this.x + this.width,
                top: this.y,
                bottom: this.y + this.height
            };
        } else {
            // Calculate bounding box for rotated rectangle
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const angle = this.rotation * Math.PI / 180;
            
            // Calculate the four corners of the rotated rectangle
            const corners = [
                { x: -this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: this.height / 2 },
                { x: -this.width / 2, y: this.height / 2 }
            ];
            
            // Rotate and translate corners
            const rotatedCorners = corners.map(corner => {
                const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle);
                const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle);
                return {
                    x: rotatedX + centerX,
                    y: rotatedY + centerY
                };
            });
            
            // Find bounding box
            const xs = rotatedCorners.map(c => c.x);
            const ys = rotatedCorners.map(c => c.y);
            
            return {
                left: Math.min(...xs),
                right: Math.max(...xs),
                top: Math.min(...ys),
                bottom: Math.max(...ys)
            };
        }
    }

    getClosestPoint(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            return new Vector2D(closestX, closestY);
        } else {
            // For rotated ice, use actual rotated rectangle logic
            return this.rotatedRectangleGetClosestPoint(ball);
        }
    }

    rotatedRectangleGetClosestPoint(ball) {
        // Transform ball position to water's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to water center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to ice's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Find closest point on axis-aligned rectangle
        const closestLocalX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestLocalY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        // Transform back to world coordinates
        const angleBack = this.rotation * Math.PI / 180;
        const rotatedBackX = closestLocalX * Math.cos(angleBack) - closestLocalY * Math.sin(angleBack);
        const rotatedBackY = closestLocalX * Math.sin(angleBack) + closestLocalY * Math.cos(angleBack);
        
        return new Vector2D(rotatedBackX + centerX, rotatedBackY + centerY);
    }
}

class Ice {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'ice';
        this.rotation = 0; // Add rotation property
        this.zIndex = 0; // Add zIndex for layering
    }

    draw(ctx) {
        if (this.rotation !== 0) {
            // Save context state
            ctx.save();
            
            // Move to building center and rotate
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Create gradient for ice effect
            const gradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
            gradient.addColorStop(0, '#E0F6FF');
            gradient.addColorStop(0.5, '#B0E0E6');
            gradient.addColorStop(1, '#87CEEB');
            
            // Draw rectangle centered at origin
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Add some sparkle effects for ice
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const sparkleX = (Math.random() - 0.5) * this.width * 0.8;
                const sparkleY = (Math.random() - 0.5) * this.height * 0.8;
                ctx.beginPath();
                ctx.moveTo(sparkleX - 3, sparkleY);
                ctx.lineTo(sparkleX + 3, sparkleY);
                ctx.moveTo(sparkleX, sparkleY - 3);
                ctx.lineTo(sparkleX, sparkleY + 3);
                ctx.stroke();
            }
            
            // Restore context state
            ctx.restore();
        } else {
            // Create gradient for ice effect
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
            gradient.addColorStop(0, '#E0F6FF');
            gradient.addColorStop(0.5, '#B0E0E6');
            gradient.addColorStop(1, '#87CEEB');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Add some sparkle effects for ice
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const sparkleX = this.x + Math.random() * this.width;
                const sparkleY = this.y + Math.random() * this.height;
                ctx.beginPath();
                ctx.moveTo(sparkleX - 3, sparkleY);
                ctx.lineTo(sparkleX + 3, sparkleY);
                ctx.moveTo(sparkleX, sparkleY - 3);
                ctx.lineTo(sparkleX, sparkleY + 3);
                ctx.stroke();
            }
        }
    }

    intersects(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            const distanceX = ball.position.x - closestX;
            const distanceY = ball.position.y - closestY;
            
            return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
        } else {
            // For rotated ice, use actual rotated rectangle collision
            return this.rotatedRectangleIntersects(ball);
        }
    }

    rotatedRectangleIntersects(ball) {
        // Transform ball position to ice's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to ice center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to ice's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Now check collision with axis-aligned rectangle
        const closestX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        const distanceX = rotatedX - closestX;
        const distanceY = rotatedY - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }

    getBoundingBox() {
        if (this.rotation === 0) {
            return {
                left: this.x,
                right: this.x + this.width,
                top: this.y,
                bottom: this.y + this.height
            };
        } else {
            // Calculate bounding box for rotated rectangle
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const angle = this.rotation * Math.PI / 180;
            
            // Calculate the four corners of the rotated rectangle
            const corners = [
                { x: -this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: -this.height / 2 },
                { x: this.width / 2, y: this.height / 2 },
                { x: -this.width / 2, y: this.height / 2 }
            ];
            
            // Rotate and translate corners
            const rotatedCorners = corners.map(corner => {
                const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle);
                const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle);
                return {
                    x: rotatedX + centerX,
                    y: rotatedY + centerY
                };
            });
            
            // Find bounding box
            const xs = rotatedCorners.map(c => c.x);
            const ys = rotatedCorners.map(c => c.y);
            
            return {
                left: Math.min(...xs),
                right: Math.max(...xs),
                top: Math.min(...ys),
                bottom: Math.max(...ys)
            };
        }
    }

    getClosestPoint(ball) {
        if (this.rotation === 0) {
            const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
            const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
            
            return new Vector2D(closestX, closestY);
        } else {
            // For rotated ice, use actual rotated rectangle logic
            return this.rotatedRectangleGetClosestPoint(ball);
        }
    }

    rotatedRectangleGetClosestPoint(ball) {
        // Transform ball position to ice's local coordinate system
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = -this.rotation * Math.PI / 180; // Negative for inverse rotation
        
        // Translate ball position relative to ice center
        const relativeX = ball.position.x - centerX;
        const relativeY = ball.position.y - centerY;
        
        // Rotate ball position to ice's local coordinates
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);
        
        // Find closest point on axis-aligned rectangle
        const closestLocalX = Math.max(-this.width / 2, Math.min(rotatedX, this.width / 2));
        const closestLocalY = Math.max(-this.height / 2, Math.min(rotatedY, this.height / 2));
        
        // Transform back to world coordinates
        const angleBack = this.rotation * Math.PI / 180;
        const rotatedBackX = closestLocalX * Math.cos(angleBack) - closestLocalY * Math.sin(angleBack);
        const rotatedBackY = closestLocalX * Math.sin(angleBack) + closestLocalY * Math.cos(angleBack);
        
        return new Vector2D(rotatedBackX + centerX, rotatedBackY + centerY);
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
        
        // Game mode
        this.gameMode = 'custom'; // 'custom' or 'premade'
        this.playerMode = 'multiplayer'; // 'single' or 'multiplayer'
        this.selectedCourse = 'beginner';
        
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
        this.isRotating = false; // For rotation
        this.rotationHandle = null; // DOM element for rotation handle
        this.rotationLine = null; // DOM element for rotation line
        this.movingBuildingOriginalPosition = null; // Store original position for collision reset
        
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

        // Game mode selection
        const customMode = document.getElementById('custom-mode');
        const premadeMode = document.getElementById('premade-mode');
        const customSettings = document.getElementById('custom-settings');
        const premadeSettings = document.getElementById('premade-settings');
        
        if (customMode) {
            customMode.addEventListener('click', () => {
                this.gameMode = 'custom';
                customMode.classList.add('active');
                premadeMode.classList.remove('active');
                customSettings.style.display = 'block';
                premadeSettings.style.display = 'none';
            });
        }
        
        if (premadeMode) {
            premadeMode.addEventListener('click', () => {
                this.gameMode = 'premade';
                premadeMode.classList.add('active');
                customMode.classList.remove('active');
                premadeSettings.style.display = 'block';
                customSettings.style.display = 'none';
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

        // Create rotation handle and line elements
        this.createRotationElements();
    }

    startGame() {
        if (this.gameMode === 'custom') {
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
        } else if (this.gameMode === 'premade') {
            this.selectedCourse = document.getElementById('course-select').value;
            this.playerMode = document.getElementById('player-mode').value;
            this.totalHoles = PREMADE_COURSES[this.selectedCourse].holes;
            this.currentState = GAME_STATES.DESIGN;
            this.currentPhase = PHASES.PLAY; // Skip design phase for premade courses
            this.currentHole = 1;
            this.currentPlayer = 1;
            this.player1Score = 0;
            this.player2Score = 0;
            
            const startScreen = document.getElementById('start-screen');
            const gameScreen = document.getElementById('game-screen');
            const buildModePanel = document.getElementById('build-mode-panel');
            
            if (startScreen) startScreen.style.display = 'none';
            if (gameScreen) gameScreen.style.display = 'block';
            if (buildModePanel) buildModePanel.style.display = 'none'; // Hide build panel for premade courses
            
            // Update UI for single player mode
            this.updateSinglePlayerUI();
            
            this.loadPremadeHole();
            this.updateUI();
            this.showMessage(`Playing ${PREMADE_COURSES[this.selectedCourse].name} - Hole ${this.currentHole}`);
        }
    }

    updateSinglePlayerUI() {
        const player2Row = document.querySelector('.score-row:nth-child(3)'); // Player 2 row
        const player2Label = document.querySelector('.score-row:nth-child(3) .player-label');
        const player2HoleScore = document.getElementById('player2-hole-score');
        const player2TotalScore = document.getElementById('player2-total-score');
        
        if (this.playerMode === 'single') {
            // Hide player 2 row for single player
            if (player2Row) player2Row.style.display = 'none';
        } else {
            // Show player 2 row for multiplayer
            if (player2Row) player2Row.style.display = 'flex';
        }
    }

    loadPremadeHole() {
        const course = PREMADE_COURSES[this.selectedCourse];
        const holeData = course.courses[this.currentHole - 1];
        
        // Set ball and hole positions
        this.ball.reset(holeData.ballPosition.x, holeData.ballPosition.y);
        this.hole.position = new Vector2D(holeData.holePosition.x, holeData.holePosition.y);
        this.spawnPosition = new Vector2D(holeData.ballPosition.x, holeData.ballPosition.y);
        
        // Clear existing walls and load premade walls
        this.walls = [];
        this.buildingHistory = [];
        
        // Create walls from hole data
        for (let wallData of holeData.walls) {
            let building;
            switch (wallData.type) {
                case 'wall':
                    building = new Wall(wallData.x, wallData.y, wallData.width, wallData.height);
                    break;
                case 'sand':
                    building = new Sand(wallData.x, wallData.y, wallData.width, wallData.height);
                    break;
                case 'tallGrass':
                    building = new TallGrass(wallData.x, wallData.y, wallData.width, wallData.height);
                    break;
                case 'water':
                    building = new Water(wallData.x, wallData.y, wallData.width, wallData.height);
                    break;
                case 'ice':
                    building = new Ice(wallData.x, wallData.y, wallData.width, wallData.height);
                    break;
            }
            
            if (building) {
                building.rotation = wallData.rotation || 0;
                building.zIndex = this.walls.length; // Simple z-index assignment
                this.walls.push(building);
            }
        }
        
        // Reset scores for this hole
        this.player1HoleScore = 0;
        this.player2HoleScore = 0;
        
        // Update ball color for current player
        this.updateBallColor();
    }

    generateCourseJSON() {
        // Generate the current hole data only
        const currentHoleData = {
            name: `Hole ${this.currentHole}`,
            ballPosition: { 
                x: Math.round(this.spawnPosition.x), 
                y: Math.round(this.spawnPosition.y) 
            },
            holePosition: { 
                x: Math.round(this.hole.position.x), 
                y: Math.round(this.hole.position.y) 
            },
            walls: []
        };

        // Convert all buildings to the JSON format
        for (let building of this.walls) {
            const wallData = {
                type: building.type,
                x: Math.round(building.x),
                y: Math.round(building.y),
                width: Math.round(building.width),
                height: Math.round(building.height),
                rotation: building.rotation || 0
            };
            currentHoleData.walls.push(wallData);
        }

        // Log the hole data in a single line for easy copy-pasting
        console.log('🎨 Custom Hole JSON:');
        
        let wallsString = '';
        for (let i = 0; i < currentHoleData.walls.length; i++) {
            const wall = currentHoleData.walls[i];
            const comma = i < currentHoleData.walls.length - 1 ? ',' : '';
            wallsString += `{ type: "${wall.type}", x: ${wall.x}, y: ${wall.y}, width: ${wall.width}, height: ${wall.height}, rotation: ${wall.rotation} }${comma}`;
        }
        
        console.log(`{ name: ${currentHoleData.name}, ballPosition: { x: ${currentHoleData.ballPosition.x}, y: ${currentHoleData.ballPosition.y} }, holePosition: { x: ${currentHoleData.holePosition.x}, y: ${currentHoleData.holePosition.y} }, walls: [${wallsString}] }`);
        
        return currentHoleData;
    }

    nextPhase() {
        if (this.gameMode === 'premade') {
            if (this.playerMode === 'single') {
                // Single player mode - add hole score to total and move to next hole
                this.player1Score += this.player1HoleScore;
                this.currentHole++;
                if (this.currentHole > this.totalHoles) {
                    this.endGame();
                    return;
                }
                this.loadPremadeHole();
                this.showMessage(`Playing ${PREMADE_COURSES[this.selectedCourse].name} - Hole ${this.currentHole}`);
            } else {
                // Multiplayer premade mode - check if both players have played
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
                    
                    // Load next hole
                    this.loadPremadeHole();
                    this.showMessage(`Playing ${PREMADE_COURSES[this.selectedCourse].name} - Hole ${this.currentHole}`);
                }
            }
        } else {
            // Original custom mode logic
            if (this.currentPhase === PHASES.DESIGN) {
                this.currentPhase = PHASES.PLAY;
                this.ball.reset(this.ball.position.x, this.ball.position.y);
                this.player1HoleScore = 0;
                this.player2HoleScore = 0;
                
                // Generate course JSON when done building
                this.generateCourseJSON();
                
                // Clear selection and hide rotation handle
                this.selectedBuilding = null;
                this.hideRotationHandle();
                
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
        }
        
        this.updateUI();
    }

    resetHole() {
        // Reset ball and hole to default positions
        this.ball.reset(this.spawnPosition.x, this.spawnPosition.y);
        this.hole.position = new Vector2D(CANVAS_WIDTH - 50, CANVAS_HEIGHT / 2);
        this.walls = [];
        this.buildingHistory = []; // Clear building history for the restarted hole
        
        // Reset hole scores but keep total scores
        this.player1HoleScore = 0;
        this.player2HoleScore = 0;
        
        // Put the current player back into build mode
        this.currentPhase = PHASES.DESIGN;
        
        // Show build mode panel
        const buildModePanel = document.getElementById('build-mode-panel');
        if (buildModePanel) buildModePanel.style.display = 'block';
        
        // Update ball color for the current player
        this.updateBallColor();
        
        this.updateUI();
        this.hideSettings();
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
        if (this.gameMode === 'premade' && this.playerMode === 'single') {
            // Single player mode - just show completion
            winnerText = `Course Complete! Final Score: ${this.player1Score}`;
        } else if (this.player1Score < this.player2Score) {
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
        this.gameMode = 'custom'; // Reset to custom mode
        this.playerMode = 'multiplayer';
        this.selectedCourse = 'beginner';
        
        // Reset UI
        const customMode = document.getElementById('custom-mode');
        const premadeMode = document.getElementById('premade-mode');
        const customSettings = document.getElementById('custom-settings');
        const premadeSettings = document.getElementById('premade-settings');
        
        if (customMode && premadeMode && customSettings && premadeSettings) {
            customMode.classList.add('active');
            premadeMode.classList.remove('active');
            customSettings.style.display = 'block';
            premadeSettings.style.display = 'none';
        }
        
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
        // Handle rotation
        if (this.isRotating) {
            this.updateRotation(e);
            return;
        }

        if (this.currentPhase === PHASES.PLAY && !this.ball.isMoving && !this.ball.isWaitingForWaterCheck) {
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
            
            // Check if clicking on existing building
            const clickedBuilding = this.getBuildingAtPosition(x, y);
            
            if (clickedBuilding) {
                // Select the building for potential deletion and rotation
                this.selectedBuilding = clickedBuilding;
                this.showRotationHandle(clickedBuilding);
                
                // Start moving existing building
                this.isMovingBuilding = true;
                this.movingBuilding = clickedBuilding;
                this.movingBuildingOffset = new Vector2D(x - clickedBuilding.x, y - clickedBuilding.y);
                
                // Store original position for collision reset
                this.movingBuildingOriginalPosition = {
                    x: clickedBuilding.x,
                    y: clickedBuilding.y,
                    rotation: clickedBuilding.rotation
                };
            } else {
                // Clicking on empty space - clear selection and start building new
                if (this.selectedBuilding) {
                    // Clear selection when clicking off a building
                    this.selectedBuilding = null;
                    this.hideRotationHandle();
                }
                
                // Start building if clicking on empty space
                const clickingOnHole = this.hole.position.distance(new Vector2D(x, y)) < this.hole.radius;
                const clickingOnBall = this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius;
                
                if (!clickingOnHole && !clickingOnBall) {
                    this.isBuilding = true;
                    this.buildStart = new Vector2D(x, y);
                    this.buildEnd = new Vector2D(x, y);
                }
            }
        }
    }

    handleMouseMove(e) {
        // Handle rotation
        if (this.isRotating) {
            this.updateRotation(e);
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update cursor based on phase and position
        if (this.currentPhase === PHASES.DESIGN) {
            const hoveringOverHole = this.hole.position.distance(new Vector2D(x, y)) < this.hole.radius;
            const hoveringOverBall = this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius;
            const hoveringOverBuilding = this.getBuildingAtPosition(x, y) !== null;
            
            if (hoveringOverHole || hoveringOverBall || hoveringOverBuilding) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'crosshair';
            }
        } else {
            // Play phase - check if hovering over ball
            if (this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius && !this.ball.isWaitingForWaterCheck) {
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
            const canvasRect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;
            
            // Calculate new position
            const newX = mouseX - this.movingBuildingOffset.x;
            const newY = mouseY - this.movingBuildingOffset.y;
            
            // Store original position for collision reset
            if (!this.movingBuildingOriginalPosition) {
                this.movingBuildingOriginalPosition = {
                    x: this.movingBuilding.x,
                    y: this.movingBuilding.y
                };
            }
            
            // Update building position
            this.movingBuilding.x = newX;
            this.movingBuilding.y = newY;
            
            // Bring the moved building to the top layer
            const maxZIndex = this.walls.length > 0 ? Math.max(...this.walls.map(b => b.zIndex)) : -1;
            this.movingBuilding.zIndex = maxZIndex + 1;
            
            // Update rotation handle position if building is selected
            if (this.selectedBuilding === this.movingBuilding) {
                this.showRotationHandle(this.movingBuilding);
            }
        }
        
        if (this.isRotating && this.selectedBuilding) {
            this.updateRotation(e);
        }
    }

    handleMouseUp(e) {
        // Handle rotation end
        if (this.isRotating) {
            this.isRotating = false;
            return;
        }

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
            this.placeBuilding();
            this.isBuilding = false;
        } else if (this.isMovingBuilding) {
            // Check for collisions when placing the building
            if (this.movingBuilding && this.movingBuildingOriginalPosition) {
                // Create a temporary building to check collisions
                const tempBuilding = {
                    x: this.movingBuilding.x,
                    y: this.movingBuilding.y,
                    width: this.movingBuilding.width,
                    height: this.movingBuilding.height,
                    type: this.movingBuilding.type,
                    rotation: this.movingBuilding.rotation,
                    intersects: function(ball) {
                        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
                        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
                        const distanceX = ball.position.x - closestX;
                        const distanceY = ball.position.y - closestY;
                        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
                    }
                };
                
                // If there are collisions or out of boundaries, reset to original position
                if (!this.isWithinBoundaries(tempBuilding.x, tempBuilding.y, tempBuilding.width, tempBuilding.height)) {
                    this.movingBuilding.x = this.movingBuildingOriginalPosition.x;
                    this.movingBuilding.y = this.movingBuildingOriginalPosition.y;
                    this.movingBuilding.rotation = this.movingBuildingOriginalPosition.rotation;
                    
                    // Update rotation handle position
                    if (this.selectedBuilding === this.movingBuilding) {
                        this.showRotationHandle(this.movingBuilding);
                    }
                }
            }
            
            this.isMovingBuilding = false;
            this.movingBuilding = null;
            this.movingBuildingOffset = new Vector2D(0, 0);
            this.movingBuildingOriginalPosition = null;
        }
    }

    handleGlobalMouseUp(e) {
        // Handle rotation end
        if (this.isRotating) {
            this.isRotating = false;
            return;
        }

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
            this.placeBuilding();
            this.isBuilding = false;
        } else if (this.isMovingBuilding) {
            // Check for collisions when placing the building
            if (this.movingBuilding && this.movingBuildingOriginalPosition) {
                // Create a temporary building to check collisions
                const tempBuilding = {
                    x: this.movingBuilding.x,
                    y: this.movingBuilding.y,
                    width: this.movingBuilding.width,
                    height: this.movingBuilding.height,
                    type: this.movingBuilding.type,
                    rotation: this.movingBuilding.rotation,
                    intersects: function(ball) {
                        const closestX = Math.max(this.x, Math.min(ball.position.x, this.x + this.width));
                        const closestY = Math.max(this.y, Math.min(ball.position.y, this.y + this.height));
                        const distanceX = ball.position.x - closestX;
                        const distanceY = ball.position.y - closestY;
                        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
                    }
                };
                
                // If there are collisions or out of boundaries, reset to original position
                if (!this.isWithinBoundaries(tempBuilding.x, tempBuilding.y, tempBuilding.width, tempBuilding.height)) {
                    this.movingBuilding.x = this.movingBuildingOriginalPosition.x;
                    this.movingBuilding.y = this.movingBuildingOriginalPosition.y;
                    this.movingBuilding.rotation = this.movingBuildingOriginalPosition.rotation;
                    
                    // Update rotation handle position
                    if (this.selectedBuilding === this.movingBuilding) {
                        this.showRotationHandle(this.movingBuilding);
                    }
                }
            }
            
            this.isMovingBuilding = false;
            this.movingBuilding = null;
            this.movingBuildingOffset = new Vector2D(0, 0);
            this.movingBuildingOriginalPosition = null;
        }
    }

    handleClick(e) {
        if (this.currentPhase === PHASES.DESIGN) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if clicked on a building
            const clickedBuilding = this.getBuildingAtPosition(x, y);
            
            if (clickedBuilding) {
                // Deselect previous building
                if (this.selectedBuilding && this.selectedBuilding !== clickedBuilding) {
                    this.hideRotationHandle();
                }
                
                // Select new building
                this.selectedBuilding = clickedBuilding;
                this.showRotationHandle(clickedBuilding);
                
                // Bring the selected building to the top layer
                const maxZIndex = this.walls.length > 0 ? Math.max(...this.walls.map(b => b.zIndex)) : -1;
                clickedBuilding.zIndex = maxZIndex + 1;
            } else {
                // Clicked on empty space, deselect building
                this.selectedBuilding = null;
                this.hideRotationHandle();
            }
        }
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
        // Store the ball's current position before taking the shot
        this.ball.lastPosition = new Vector2D(this.ball.position.x, this.ball.position.y);
        
        this.ball.velocity = velocity;
        this.ball.isMoving = true;
        
        if (this.gameMode === 'premade' && this.playerMode === 'single') {
            // Single player mode - just increment player 1 score
            this.player1HoleScore++;
        } else if (this.gameMode === 'premade' && this.playerMode === 'multiplayer') {
            // Multiplayer premade mode - determine which player is shooting based on ball color
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
        } else {
            // Original custom mode multiplayer logic
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
        }
        
        this.updateUI();
    }

    checkCollisions() {
        // Skip collision detection in build mode to prevent ball movement
        if (this.currentPhase === PHASES.DESIGN) {
            return;
        }
        
        // Check boundary wall collisions
        for (let wall of this.boundaryWalls) {
            if (wall.intersects(this.ball)) {
                this.resolveCollision(wall);
            }
        }
        
        // Check building collisions - only check the topmost building at each position
        let topmostBuilding = null;
        let highestZIndex = -1;
        
        for (let building of this.walls) {
            if (building.intersects(this.ball)) {
                if (building.zIndex > highestZIndex) {
                    highestZIndex = building.zIndex;
                    topmostBuilding = building;
                }
            }
        }
        
        // Only resolve collision with the topmost building
        if (topmostBuilding) {
            if (topmostBuilding.type === 'wall') {
                this.resolveCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'sand') {
                this.resolveSandCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'tallGrass') {
                this.resolveTallGrassCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'water') {
                this.resolveWaterCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'ice') {
                this.resolveIceCollision(topmostBuilding);
            }
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
        
        // Check boundary collisions with improved detection
        for (let wall of this.boundaryWalls) {
            if (wall.intersects(this.ball)) {
                this.resolveCollision(wall);
            }
        }
        
        // Check building collisions - only check the topmost building at each position (same as main checkCollisions)
        let topmostBuilding = null;
        let highestZIndex = -1;
        
        for (let building of this.walls) {
            if (building.intersects(this.ball)) {
                if (building.zIndex > highestZIndex) {
                    highestZIndex = building.zIndex;
                    topmostBuilding = building;
                }
            }
        }
        
        // Only resolve collision with the topmost building
        if (topmostBuilding) {
            if (topmostBuilding.type === 'wall') {
                this.resolveCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'sand') {
                this.resolveSandCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'tallGrass') {
                this.resolveTallGrassCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'water') {
                this.resolveWaterCollision(topmostBuilding);
            } else if (topmostBuilding.type === 'ice') {
                this.resolveIceCollision(topmostBuilding);
            }
        } else {
            // Reset to normal friction if not on any terrain
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
        // Water acts like other terrain - just apply friction
        // The ball will be moved back later if it stops over water
        this.ball.currentFriction = WATER_FRICTION; // Water has high friction
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
            
            if (this.gameMode === 'premade' && this.playerMode === 'single') {
                // Single player mode - just complete the hole
                this.showMessage(`Hole ${this.currentHole} complete!`);
                // Automatically move to next hole after confetti and delay
                setTimeout(() => {
                    this.nextPhase();
                }, 2000);
            } else if (this.gameMode === 'premade' && this.playerMode === 'multiplayer') {
                // Multiplayer premade mode - same logic as custom mode
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
                    }, 2000);
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
                    }, 2000);
                }
            } else {
                // Original custom mode multiplayer logic
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
    }

    updateUI() {
        // Debug: Check if elements exist
        const player1HoleScoreEl = document.getElementById('player1-hole-score');
        const player2HoleScoreEl = document.getElementById('player2-hole-score');
        const player1TotalScoreEl = document.getElementById('player1-total-score');
        const player2TotalScoreEl = document.getElementById('player2-total-score');
        const currentHoleEl = document.getElementById('current-hole');
        const totalHolesEl = document.getElementById('total-holes');
        
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
        
        // Update single player UI if needed
        if (this.gameMode === 'premade') {
            this.updateSinglePlayerUI();
        }
    }

    updateBallColor() {
        if (this.currentPhase === PHASES.PLAY) {
            // Determine which player is currently playing based on scores
            let playingPlayer;
            
            if (this.gameMode === 'premade' && this.playerMode === 'single') {
                // Single player mode - always player 1
                playingPlayer = 1;
            } else if (this.player1HoleScore === 0 && this.player2HoleScore === 0) {
                // No one has completed yet, so the first player plays
                playingPlayer = 1;
            } else if (this.player1HoleScore > 0 && this.player2HoleScore === 0) {
                // Player 1 has completed, so Player 2 is playing now
                playingPlayer = 2;
            } else if (this.player1HoleScore === 0 && this.player2HoleScore > 0) {
                // Player 2 has completed, so Player 1 is playing now
                playingPlayer = 1;
            } else {
                // Both have completed, this shouldn't happen in normal flow
                playingPlayer = 1;
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
        // Sort buildings by zIndex and type to ensure proper layering
        const sortedBuildings = [...this.walls].sort((a, b) => {
            // First sort by type: terrain first, then walls
            if (a.type !== 'wall' && b.type === 'wall') return -1;
            if (a.type === 'wall' && b.type !== 'wall') return 1;
            // Then sort by zIndex within each type
            return a.zIndex - b.zIndex;
        });
        
        for (let building of sortedBuildings) {
            building.draw(this.ctx);
            
            // Draw selection highlight if this building is selected
            if (building === this.selectedBuilding) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
                
                if (building.rotation === 0) {
                    // Draw regular rectangle for non-rotated buildings
                    this.ctx.strokeRect(building.x - 2, building.y - 2, building.width + 4, building.height + 4);
                } else {
                    // Draw rotated rectangle for rotated buildings
                    this.ctx.save();
                    
                    const centerX = building.x + building.width / 2;
                    const centerY = building.y + building.height / 2;
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(building.rotation * Math.PI / 180);
                    
                    // Draw rectangle centered at origin with padding
                    this.ctx.strokeRect(-building.width / 2 - 2, -building.height / 2 - 2, building.width + 4, building.height + 4);
                    
                    this.ctx.restore();
                }
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
        
        // Check if preview would overlap with hole
        const buildingLeft = startX;
        const buildingRight = startX + width;
        const buildingTop = startY;
        const buildingBottom = startY + height;
        
        const closestX = Math.max(buildingLeft, Math.min(this.hole.position.x, buildingRight));
        const closestY = Math.max(buildingTop, Math.min(this.hole.position.y, buildingBottom));
        
        const distanceX = this.hole.position.x - closestX;
        const distanceY = this.hole.position.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        const wouldOverlapHole = distanceSquared < (this.hole.radius * this.hole.radius);
        
        // Draw preview with transparency
        this.ctx.globalAlpha = 0.6;
        
        if (this.currentBuildingType === 'wall') {
            this.ctx.fillStyle = wouldOverlapHole ? '#FF0000' : '#8B4513';
            this.ctx.fillRect(startX, startY, width, height);
            this.ctx.strokeStyle = wouldOverlapHole ? '#CC0000' : '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'sand') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            if (wouldOverlapHole) {
                gradient.addColorStop(0, '#FF6666');
                gradient.addColorStop(0.5, '#FF8888');
                gradient.addColorStop(1, '#FFAAAA');
            } else {
                gradient.addColorStop(0, '#F4D03F');
                gradient.addColorStop(0.5, '#F7DC6F');
                gradient.addColorStop(1, '#F8C471');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'tallGrass') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            if (wouldOverlapHole) {
                gradient.addColorStop(0, '#FF6666');
                gradient.addColorStop(0.5, '#FF8888');
                gradient.addColorStop(1, '#FFAAAA');
            } else {
                gradient.addColorStop(0, '#2E8B57');
                gradient.addColorStop(0.5, '#3CB371');
                gradient.addColorStop(1, '#228B22');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'water') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            if (wouldOverlapHole) {
                gradient.addColorStop(0, '#FF6666');
                gradient.addColorStop(0.5, '#FF8888');
                gradient.addColorStop(1, '#FFAAAA');
            } else {
                gradient.addColorStop(0, '#1E90FF');
                gradient.addColorStop(0.5, '#00BFFF');
                gradient.addColorStop(1, '#87CEEB');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(startX, startY, width, height);
        } else if (this.currentBuildingType === 'ice') {
            const gradient = this.ctx.createLinearGradient(startX, startY, startX + width, startY + height);
            if (wouldOverlapHole) {
                gradient.addColorStop(0, '#FF6666');
                gradient.addColorStop(0.5, '#FF8888');
                gradient.addColorStop(1, '#FFAAAA');
            } else {
                gradient.addColorStop(0, '#E0F6FF');
                gradient.addColorStop(0.5, '#F0F8FF');
                gradient.addColorStop(1, '#E6F3FF');
            }
            
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
        // Unselect any currently selected building when changing building type
        if (this.selectedBuilding) {
            this.selectedBuilding = null;
            this.hideRotationHandle();
        }
        
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
        if (!this.isBuilding) {
            return;
        }
        
        const startX = Math.min(this.buildStart.x, this.buildEnd.x);
        const startY = Math.min(this.buildStart.y, this.buildEnd.y);
        const endX = Math.max(this.buildStart.x, this.buildEnd.x);
        const endY = Math.max(this.buildStart.y, this.buildEnd.y);
        
        const width = endX - startX;
        const height = endY - startY;
        
        if (width < 10 || height < 10) {
            this.isBuilding = false;
            return;
        }
        
        // Check if building would overlap with ball or hole
        const buildingCenterX = startX + width / 2;
        const buildingCenterY = startY + height / 2;
        
        // Check ball overlap
        const ballDistance = Math.sqrt(
            Math.pow(buildingCenterX - this.ball.position.x, 2) + 
            Math.pow(buildingCenterY - this.ball.position.y, 2)
        );
        const ballMinDistance = this.ball.radius + Math.max(width, height) / 2;
        
        if (ballDistance < ballMinDistance) {
            this.isBuilding = false;
            return;
        }
        
        // Check hole overlap - more precise detection
        const holeLeft = this.hole.position.x - this.hole.radius;
        const holeRight = this.hole.position.x + this.hole.radius;
        const holeTop = this.hole.position.y - this.hole.radius;
        const holeBottom = this.hole.position.y + this.hole.radius;
        
        // Check if building rectangle overlaps with hole circle
        const buildingLeft = startX;
        const buildingRight = startX + width;
        const buildingTop = startY;
        const buildingBottom = startY + height;
        
        // Check for rectangle-circle intersection
        const closestX = Math.max(buildingLeft, Math.min(this.hole.position.x, buildingRight));
        const closestY = Math.max(buildingTop, Math.min(this.hole.position.y, buildingBottom));
        
        const distanceX = this.hole.position.x - closestX;
        const distanceY = this.hole.position.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        if (distanceSquared < (this.hole.radius * this.hole.radius)) {
            this.isBuilding = false;
            return;
        }
        
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
        } else {
            this.isBuilding = false;
            return;
        }
        
        if (newBuilding) {
            // Implement layering system: walls always on top, terrain below
            if (this.currentBuildingType === 'wall') {
                // Walls get the highest zIndex (always on top)
                const maxZIndex = this.walls.length > 0 ? Math.max(...this.walls.map(b => b.zIndex)) : 999;
                newBuilding.zIndex = maxZIndex + 1;
            } else {
                // Terrain (sand, tallGrass, water, ice) gets lower zIndex
                const terrainBuildings = this.walls.filter(b => b.type !== 'wall');
                const maxTerrainZIndex = terrainBuildings.length > 0 ? Math.max(...terrainBuildings.map(b => b.zIndex)) : 0;
                newBuilding.zIndex = maxTerrainZIndex + 1;
            }
            
            this.walls.push(newBuilding);
            this.buildingHistory.push(newBuilding);
        }
        
        this.isBuilding = false;
    }

    getBuildingAtPosition(x, y) {
        let topmostBuilding = null;
        let highestZIndex = -1;
        
        for (let building of this.walls) {
            const bounds = this.getBuildingBoundingBox(building);
            if (bounds.left <= x && bounds.right >= x &&
                bounds.top <= y && bounds.bottom >= y) {
                if (building.zIndex > highestZIndex) {
                    highestZIndex = building.zIndex;
                    topmostBuilding = building;
                }
            }
        }
        
        return topmostBuilding;
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
            
            // Reset selected building and hide rotation handle
            this.selectedBuilding = null;
            this.hideRotationHandle();
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

    createRotationElements() {
        // Create rotation handle
        this.rotationHandle = document.createElement('div');
        this.rotationHandle.className = 'rotation-handle';
        this.rotationHandle.style.display = 'none';
        document.body.appendChild(this.rotationHandle);

        // Add event listeners for rotation
        this.rotationHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.isRotating = true;
        });
    }

    showRotationHandle(building) {
        if (!this.rotationHandle) return;
        
        const canvasRect = this.canvas.getBoundingClientRect();
        const centerX = building.x + building.width / 2;
        const centerY = building.y + building.height / 2;
        
        // Calculate handle position based on building rotation
        const angle = building.rotation * Math.PI / 180;
        const handleDistance = building.height / 2 + 10; // Exactly 10 pixels above the top
        
        // Position handle above the building (rotated)
        const handleX = centerX + Math.sin(angle) * handleDistance;
        const handleY = centerY - Math.cos(angle) * handleDistance;
        
        // Position the handle relative to the canvas, accounting for the handle's own size (20x20)
        this.rotationHandle.style.left = (canvasRect.left + handleX - 10) + 'px';
        this.rotationHandle.style.top = (canvasRect.top + handleY - 10) + 'px';
        this.rotationHandle.style.display = 'block';
    }

    hideRotationHandle() {
        if (this.rotationHandle) {
            this.rotationHandle.style.display = 'none';
        }
    }

    updateRotation(e) {
        if (!this.selectedBuilding || !this.isRotating) return;
        
        const canvasRect = this.canvas.getBoundingClientRect();
        const centerX = this.selectedBuilding.x + this.selectedBuilding.width / 2;
        const centerY = this.selectedBuilding.y + this.selectedBuilding.height / 2;
        
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;
        this.selectedBuilding.rotation = angle;
        
        // Update rotation handle position
        this.showRotationHandle(this.selectedBuilding);
    }

    getBuildingBoundingBox(building) {
        if (!building.rotation || building.rotation === 0) {
            return {
                left: building.x,
                right: building.x + building.width,
                top: building.y,
                bottom: building.y + building.height
            };
        } else {
            // Calculate bounding box for rotated rectangle
            const centerX = building.x + building.width / 2;
            const centerY = building.y + building.height / 2;
            const angle = building.rotation * Math.PI / 180;
            // Four corners of the rectangle
            const corners = [
                { x: -building.width / 2, y: -building.height / 2 },
                { x: building.width / 2, y: -building.height / 2 },
                { x: building.width / 2, y: building.height / 2 },
                { x: -building.width / 2, y: building.height / 2 }
            ];
            // Rotate and translate corners
            const rotatedCorners = corners.map(corner => {
                const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle);
                const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle);
                return {
                    x: rotatedX + centerX,
                    y: rotatedY + centerY
                };
            });
            // Find bounding box
            const xs = rotatedCorners.map(c => c.x);
            const ys = rotatedCorners.map(c => c.y);
            return {
                left: Math.min(...xs),
                right: Math.max(...xs),
                top: Math.min(...ys),
                bottom: Math.max(...ys)
            };
        }
    }

    // Method to check if the ball is over water (called when ball stops moving)
    checkIfBallOverWater() {
        const ballCenter = this.ball.position;
        
        // First, check if there's any terrain on top of the ball (respecting layering)
        let topmostBuilding = null;
        let highestZIndex = -1;
        
        for (let building of this.walls) {
            if (building.intersects(this.ball)) {
                if (building.zIndex > highestZIndex) {
                    highestZIndex = building.zIndex;
                    topmostBuilding = building;
                }
            }
        }
        
        // If there's a building on top that's not water, the ball is not over water
        if (topmostBuilding && topmostBuilding.type !== 'water') {
            return { isOverWater: false, water: null };
        }
        
        // If there's water on top, check if the ball is over it
        if (topmostBuilding && topmostBuilding.type === 'water') {
            const building = topmostBuilding;
            
            // Calculate how much of the ball is over water
            const ballLeft = ballCenter.x - this.ball.radius;
            const ballRight = ballCenter.x + this.ball.radius;
            const ballTop = ballCenter.y - this.ball.radius;
            const ballBottom = ballCenter.y + this.ball.radius;
            
            const waterLeft = building.x;
            const waterRight = building.x + building.width;
            const waterTop = building.y;
            const waterBottom = building.y + building.height;
            
            // Calculate overlap area
            const overlapLeft = Math.max(ballLeft, waterLeft);
            const overlapRight = Math.min(ballRight, waterRight);
            const overlapTop = Math.max(ballTop, waterTop);
            const overlapBottom = Math.min(ballBottom, waterBottom);
            
            if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
                const overlapArea = (overlapRight - overlapLeft) * (overlapBottom - overlapTop);
                const ballArea = Math.PI * this.ball.radius * this.ball.radius;
                const overlapPercentage = overlapArea / ballArea;
                
                // If more than 50% of ball is over water, return true
                if (overlapPercentage > 0.5) {
                    return { isOverWater: true, water: building };
                }
            }
        }
        
        return { isOverWater: false, water: null };
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GolfGame();
}); 