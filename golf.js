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

    test: {
        name: "Test Course",
        holes: 2,
        courses: [
            {
                name: "Hole 1",
                ballPosition: { x: 50, y: 104 },
                holePosition: { x: 50, y: 306 },
                walls: [
                    { type: "ice", x: 0, y: 0, width: 800, height: 400, rotation: 0 },

                    { type: "wall", x: 0, y: 200, width: 600, height: 10, rotation: 0},
                    { type: "wall", x: 650, y: -150, width: 300, height: 300, rotation: 45},
                    { type: "wall", x: 650, y: 250, width: 300, height: 300, rotation: 45},

                    { type: "wall", x: 100, y: 50, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 100, y: 100, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 100, y: 150, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 100, y: 250, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 100, y: 300, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 100, y: 350, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 25, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 75, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 125, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 175, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 225, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 275, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 325, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 150, y: 375, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 200, y: 50, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 200, y: 100, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 200, y: 150, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 200, y: 250, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 200, y: 300, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 200, y: 350, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 25, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 75, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 125, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 175, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 225, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 275, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 325, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 250, y: 375, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 300, y: 50, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 300, y: 100, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 300, y: 150, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 300, y: 250, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 300, y: 300, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 300, y: 350, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 25, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 75, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 125, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 175, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 225, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 275, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 325, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 350, y: 375, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 400, y: 50, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 400, y: 100, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 400, y: 150, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 400, y: 250, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 400, y: 300, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 400, y: 350, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 25, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 75, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 125, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 175, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 225, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 275, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 325, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 450, y: 375, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 500, y: 50, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 500, y: 100, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 500, y: 150, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 500, y: 250, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 500, y: 300, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 500, y: 350, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 25, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 75, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 125, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 175, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 225, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 275, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 325, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 550, y: 375, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 600, y: 50, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 600, y: 100, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 600, y: 150, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 600, y: 250, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 600, y: 300, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 600, y: 350, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 650, y: 125, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 650, y: 175, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 650, y: 225, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 650, y: 275, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 700, y: 150, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 700, y: 200, width: 2, height: 2, rotation: 0},
                    { type: "wall", x: 700, y: 250, width: 2, height: 2, rotation: 0},
                ]
            },
            {
                name: "Hole 2",
                ballPosition: { x: 309, y: 45 },
                holePosition: { x: 499, y: 82 },
                walls: [
                    // Walls and obstacles
                    { type: "wall", x: 580, y: 15, width: 65, height: 63, rotation: -135.7345210342548 },
                    { type: "wall", x: -30, y: 358, width: 117, height: 197, rotation: -135.8487642715536 },
                    { type: "wall", x: 317, y: 122, width: 83, height: 83, rotation: 134.4694986833262 },
                    { type: "wall", x: 357, y: -4, width: 84, height: 267, rotation: 0 },
                    { type: "wall", x: 100, y: 98, width: 10, height: 211, rotation: 0 },
                    { type: "wall", x: 100, y: 88, width: 164, height: 10, rotation: 0 },
                    { type: "wall", x: 177, y: 158, width: 180, height: 11, rotation: 0 },
                    { type: "wall", x: 112, y: 228, width: 147, height: 10, rotation: 0 },
                    { type: "wall", x: 559, y: 106, width: 11, height: 205, rotation: 0 },
                    { type: "wall", x: 557, y: -45, width: 263, height: 103, rotation: 0 },
                    { type: "wall", x: 431, y: 129, width: 10, height: 182, rotation: 0 },
                    { type: "wall", x: 487, y: 150, width: 25, height: 90, rotation: 0 },
                    { type: "wall", x: 663, y: 126, width: 10, height: 161, rotation: 0 },
                    
                    // Sand traps
                    { type: "sand", x: 111, y: 236, width: 149, height: 73, rotation: 0 },
                    { type: "sand", x: 663, y: 39, width: 148, height: 385, rotation: 0 },
                    { type: "sand", x: -26, y: 344, width: 82, height: 87, rotation: 0 },
                    { type: "sand", x: 107, y: 96, width: 17, height: 144, rotation: 0 },
                    
                    // Water hazards
                    { type: "water", x: 372, y: 215, width: 86, height: 76, rotation: 29.99507961713978 },
                    { type: "water", x: 421, y: -34, width: 136, height: 91, rotation: 0 },
                    
                    // Ice patches
                    { type: "ice", x: 442, y: 105, width: 117, height: 206, rotation: 0 },
                    { type: "ice", x: 111, y: 93, width: 271, height: 141, rotation: 0 },
                    
                    // Tall grass areas
                    { type: "tallGrass", x: 52, y: 366, width: 518, height: 44, rotation: -175.17923392190735 },
                    { type: "tallGrass", x: 87, y: 87, width: 18, height: 223, rotation: 0 },
                    { type: "tallGrass", x: -62, y: -55, width: 122, height: 112, rotation: -135.97102193107918 }
                ]
            }
        ]
    },
    beginner: {
        name: "Beginner Course",
        holes: 3,
        courses: [
            {
                name: "Hole 1",
                ballPosition: { x: 311, y: 100 },
                holePosition: { x: 553, y: 293 },
                walls: [
                    // Tall grass areas
                    { type: "tallGrass", x: 396, y: 195, width: 97, height: 194, rotation: 0 },
                    { type: "tallGrass", x: 142, y: -39, width: 614, height: 72, rotation: 0 },
                    { type: "tallGrass", x: -239, y: -18, width: 476, height: 51, rotation: 0 },
                    { type: "tallGrass", x: 135, y: 27, width: 93, height: 175, rotation: 0 },
                    { type: "tallGrass", x: -13, y: 163, width: 606, height: 38, rotation: 0 },
                    { type: "tallGrass", x: 447, y: 182, width: 146, height: 39, rotation: 0 },
                    { type: "tallGrass", x: 591, y: 163, width: 19, height: 58, rotation: 0 },
                    
                    // Sand traps
                    { type: "sand", x: 255, y: 198, width: 146, height: 227, rotation: 0 },
                    { type: "sand", x: 3, y: -28, width: 161, height: 224, rotation: 0 },
                    
                    // Water hazards
                    { type: "water", x: -135, y: 190, width: 391, height: 223, rotation: 0 },
                    
                    // Walls and obstacles
                    { type: "wall", x: -5, y: 187, width: 597, height: 13, rotation: 0 },
                    { type: "wall", x: 693, y: -49, width: 168, height: 117, rotation: -134.83950804016538 },
                    { type: "wall", x: 724, y: 314, width: 183, height: 217, rotation: 135.34104227885885 }
                ]
            },
            {
                name: "Hole 2",
                ballPosition: { x: 118, y: 298 },
                holePosition: { x: 694, y: 89 },
                walls: [
                    // Tall grass areas
                    { type: "tallGrass", x: 178, y: 221, width: 400, height: 29, rotation: 0 },
                    
                    // Sand traps
                    { type: "sand", x: 305, y: 359, width: 511, height: 36, rotation: 0 },
                    { type: "sand", x: -27, y: 359, width: 353, height: 40, rotation: 0 },
                    
                    // Ice patches
                    { type: "ice", x: -86, y: -54, width: 616, height: 281, rotation: 0 },
                    
                    // Water hazards
                    { type: "water", x: 758, y: -39, width: 44, height: 496, rotation: 0 },
                    { type: "water", x: 531, y: 3, width: 249, height: 37, rotation: 0 },
                    
                    // Walls and obstacles
                    { type: "wall", x: 623, y: 287, width: 95, height: 10, rotation: 139.3987053549955 },
                    { type: "wall", x: 178, y: 103, width: 400, height: 124, rotation: 0 },
                    { type: "wall", x: 531, y: 6, width: 12, height: 35, rotation: 0 },
                    { type: "wall", x: -110, y: -154, width: 277, height: 250, rotation: 140.0025298852914 },
                    { type: "wall", x: 8, y: -62, width: 54, height: 488, rotation: 0 },
                    { type: "wall", x: 739, y: 343, width: 85, height: 85, rotation: 0 }
                ]
            },
            {
                name: "Hole 3",
                ballPosition: { x: 50, y: 200 },
                holePosition: { x: 731, y: 44 },
                walls: [
                    // Tall grass areas
                    { type: "tallGrass", x: 407, y: 95, width: 29, height: 192, rotation: 0 },
                    
                    // Sand traps
                    { type: "sand", x: 509, y: -67, width: 43, height: 212, rotation: 0 },
                    { type: "sand", x: 514, y: 239, width: 43, height: 156, rotation: 0 },
                    
                    // Ice patches
                    { type: "ice", x: -13, y: -70, width: 424, height: 555, rotation: 0 },
                    
                    // Water hazards
                    { type: "water", x: 649, y: 238, width: 160, height: 204, rotation: 0 },
                    
                    // Walls and obstacles
                    { type: "wall", x: 632, y: -18, width: 53, height: 61, rotation: 40.68397248013438 },
                    { type: "wall", x: 757, y: -34, width: 65, height: 61, rotation: -145.23480276342323 },
                    { type: "wall", x: 197, y: 96, width: 213, height: 190, rotation: 0 },
                    { type: "wall", x: 550, y: 10, width: 116, height: 135, rotation: 0 },
                    { type: "wall", x: 551, y: 238, width: 118, height: 166, rotation: 0 },
                    { type: "wall", x: -54, y: -72, width: 129, height: 135, rotation: -42.54596832547293 },
                    { type: "wall", x: -64, y: 329, width: 130, height: 142, rotation: -132.02197934805025 }
                ]
            }
        ]
    },

    advanced: {
        name: "Advanced Course",
        holes: 5,
        courses: [
            {
                name: "Hole 1",
                ballPosition: { x: 127, y: 306 },
                holePosition: { x: 695, y: 115 },
                walls: [
                    { type: "tallGrass", x: 274, y: 131, width: 89, height: 314, rotation: 0 },
                    { type: "tallGrass", x: 431, y: -56, width: 58, height: 328, rotation: 0 },
                    { type: "ice", x: -14, y: 4, width: 531, height: 58, rotation: 0 },
                    { type: "ice", x: 9, y: 48, width: 56, height: 357, rotation: 0 },
                    { type: "sand", x: 318, y: 338, width: 490, height: 58, rotation: 0 },
                    { type: "ice", x: 572, y: 67, width: 240, height: 119, rotation: 0 },
                    { type: "water", x: 580, y: -20, width: 212, height: 87, rotation: 0 },
                    { type: "wall", x: 479, y: -18, width: 129, height: 289, rotation: 0 },
                    { type: "wall", x: 194, y: 132, width: 128, height: 376, rotation: 0 },
                    { type: "wall", x: -46, y: -72, width: 119, height: 111, rotation: -41 },
                    { type: "wall", x: 431, y: -38, width: 87, height: 83, rotation: -137 },
                    { type: "wall", x: 289, y: 357, width: 79, height: 83, rotation: -49 },
                    { type: "wall", x: 752, y: 354, width: 77, height: 79, rotation: -46 },
                    { type: "wall", x: 666, y: 68, width: 58, height: 10, rotation: 0 }
                ]
            },
            {
                name: "Hole 2",
                ballPosition: { x: 79, y: 318 },
                holePosition: { x: 730, y: 54 },
                walls: [
                    { type: "tallGrass", x: 593, y: 58, width: 79, height: 266, rotation: 0 },
                    { type: "tallGrass", x: 185, y: 123, width: 323, height: 281, rotation: 0 },
                    { type: "sand", x: 184, y: 102, width: 325, height: 20, rotation: 0 },
                    { type: "sand", x: 7, y: 215, width: 95, height: 25, rotation: 0 },
                    { type: "sand", x: 501, y: 89, width: 85, height: 33, rotation: 0 },
                    { type: "sand", x: 586, y: 10, width: 93, height: 10, rotation: 0 },
                    { type: "sand", x: 586, y: 50, width: 93, height: 10, rotation: 0 },
                    { type: "ice", x: 586, y: 321, width: 95, height: 69, rotation: 0 },
                    { type: "ice", x: 676, y: 83, width: 114, height: 311, rotation: 0 },
                    { type: "water", x: 7, y: 6, width: 161, height: 46, rotation: 0 },
                    { type: "wall", x: 169, y: 5, width: 10, height: 50, rotation: 0 },
                    { type: "wall", x: 170, y: 191, width: 255, height: 10, rotation: -148.5 },
                    { type: "wall", x: 445, y: 113, width: 12, height: 168, rotation: 35 },
                    { type: "wall", x: 587, y: 61, width: 10, height: 259, rotation: 0 },
                    { type: "wall", x: 587, y: 315, width: 91, height: 10, rotation: 0 },
                    { type: "wall", x: 669, y: 59, width: 10, height: 266, rotation: 0 },
                    { type: "wall", x: 587, y: 59, width: 92, height: 12, rotation: 0 },
                    { type: "wall", x: 222, y: 31, width: 59, height: 13, rotation: -150 },
                    { type: "wall", x: 173, y: 29, width: 61, height: 13, rotation: 154 },
                    { type: "wall", x: 269, y: 33, width: 57, height: 12, rotation: 151 },
                    { type: "wall", x: 316, y: 30, width: 51, height: 13, rotation: -158 },
                    { type: "wall", x: 498, y: 90, width: 10, height: 32, rotation: 0 },
                    { type: "wall", x: 361, y: 32, width: 51, height: 13, rotation: 160 },
                    { type: "wall", x: 403, y: -3, width: 12, height: 38, rotation: 0 },
                    { type: "wall", x: 545, y: 76, width: 12, height: 12, rotation: 0 },
                    { type: "wall", x: 726, y: 176, width: 12, height: 12, rotation: 0 },
                    { type: "wall", x: 696, y: 244, width: 12, height: 12, rotation: 0 },
                    { type: "wall", x: 753, y: 110, width: 12, height: 12, rotation: 0 },
                    { type: "wall", x: 751, y: 311, width: 56, height: 131, rotation: -137 },
                    { type: "wall", x: 11, y: 231, width: 92, height: 10, rotation: 180 },
                    { type: "wall", x: 89, y: 122, width: 419, height: 11, rotation: 0 },
                    { type: "wall", x: 185, y: 296, width: 12, height: 105, rotation: 0 },
                ]
            },
            {
                name: "Hole 3",
                ballPosition: { x: 728, y: 348 },
                holePosition: { x: 724, y: 61 },
                walls: [
                    // Tall grass areas
                    { type: "tallGrass", x: 239, y: 212, width: 133, height: 67, rotation: 0 },
                    { type: "tallGrass", x: 199, y: 197, width: 68, height: 68, rotation: -142.02839623894963 },
                    { type: "tallGrass", x: 355, y: 220, width: 41, height: 45, rotation: -49.23639479905884 },
                    { type: "tallGrass", x: 350, y: 239, width: 38, height: 32, rotation: 39.95754893082909 },
                    { type: "tallGrass", x: 221, y: -31, width: 359, height: 79, rotation: 0 },
                    { type: "tallGrass", x: 303, y: 78, width: 238, height: 41, rotation: 0 },
                    { type: "tallGrass", x: 532, y: -22, width: 270, height: 50, rotation: 0 },
                    { type: "tallGrass", x: 768, y: -56, width: 33, height: 211, rotation: 0 },
                    { type: "tallGrass", x: 527, y: 84, width: 30, height: 29, rotation: -133.8308606720926 },
                    
                    // Sand traps
                    { type: "sand", x: 427, y: 351, width: 137, height: 107, rotation: 46.05311263232383 },
                    { type: "sand", x: 176, y: 318, width: 310, height: 105, rotation: 0 },
                    { type: "sand", x: -153, y: 222, width: 405, height: 303, rotation: 37.316018170266034 },
                    
                    // Water hazards
                    { type: "water", x: 756, y: 225, width: 332, height: 157, rotation: 36.41336723174498 },
                    { type: "water", x: 717, y: 196, width: 84, height: 48, rotation: 0 },
                    { type: "water", x: 649, y: 202, width: 165, height: 50, rotation: -146.08828646356076 },
                    { type: "water", x: 515, y: 155, width: 275, height: 42, rotation: 0 },
                    { type: "water", x: -59, y: -94, width: 292, height: 240, rotation: 128.13000769178575 },
                    
                    // Walls and obstacles
                    { type: "wall", x: 725, y: 160, width: 11, height: 203, rotation: -53.46404566396268 },
                    { type: "wall", x: 507, y: 196, width: 146, height: 11, rotation: 0 },
                    { type: "wall", x: 506, y: 154, width: 10, height: 53, rotation: 0 },
                    { type: "wall", x: 307, y: 154, width: 209, height: 10, rotation: 0 },
                    { type: "wall", x: 527, y: -56, width: 118, height: 110, rotation: 128.99099404250546 },
                    { type: "wall", x: 459, y: 177, width: 58, height: 10, rotation: -135 }
                ]
            },
            {
                name: "Hole 4",
                ballPosition: { x: 91, y: 201 },
                holePosition: { x: 750, y: 200 },
                walls: [
                    { type: 'ice', x: 160, y: 210, width: 525, height: 180, rotation: 0 },
                    { type: 'water', x: 685, y: 225, width: 105, height: 163, rotation: 0 },
                    { type: 'tallGrass', x: 160, y: 12, width: 525, height: 190, rotation: 0 },
                    { type: 'sand', x: 685, y: 15, width: 105, height: 163, rotation: 0 },
                    { type: 'wall', x: 200, y: 200, width: 420, height: 10, rotation: 0 }
                ]
            },
            {
                name: "Hole 5",
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
            
            // Draw rectangle centered at origin with solid color
            ctx.fillStyle = '#F4D03F';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Restore context state
            ctx.restore();
        } else {
            // Draw with solid color
            ctx.fillStyle = '#F4D03F';
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
            
            // Draw rectangle centered at origin with solid color
            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Restore context state
            ctx.restore();
        } else {
            // Draw with solid color
            ctx.fillStyle = '#2E8B57';
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
            
            // Draw rectangle centered at origin with solid color
            ctx.fillStyle = '#1E90FF';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Restore context state
            ctx.restore();
        } else {
            // Draw with solid color
            ctx.fillStyle = '#1E90FF';
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
            
            // Draw rectangle centered at origin with solid color
            ctx.fillStyle = '#E0F6FF';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Add minimal sparkle effects for ice (reduced from 3 to 1)
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            const sparkleX = (Math.random() - 0.5) * this.width * 0.6;
            const sparkleY = (Math.random() - 0.5) * this.height * 0.6;
            ctx.beginPath();
            ctx.moveTo(sparkleX - 2, sparkleY);
            ctx.lineTo(sparkleX + 2, sparkleY);
            ctx.moveTo(sparkleX, sparkleY - 2);
            ctx.lineTo(sparkleX, sparkleY + 2);
            ctx.stroke();
            
            // Restore context state
            ctx.restore();
        } else {
            // Draw with solid color
            ctx.fillStyle = '#E0F6FF';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Add minimal sparkle effects for ice (reduced from 3 to 1)
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            const sparkleX = this.x + Math.random() * this.width;
            const sparkleY = this.y + Math.random() * this.height;
            ctx.beginPath();
            ctx.moveTo(sparkleX - 2, sparkleY);
            ctx.lineTo(sparkleX + 2, sparkleY);
            ctx.moveTo(sparkleX, sparkleY - 2);
            ctx.lineTo(sparkleX, sparkleY + 2);
            ctx.stroke();
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
        
        // Audio elements
        this.ballHitSound = document.getElementById('ball-hit-sound');
        this.waterSplashSound = document.getElementById('water-splash-sound');
        this.holeSuccessSound = document.getElementById('hole-success-sound');
        this.buttonClickSound = document.getElementById('button-click-sound');
        
        // Volume control
        this.soundVolume = 0.7; // Default 70%
        this.initializeVolume();
        
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
        
        // Timer properties
        this.timerEnabled = false;
        this.timerSeconds = 30;
        this.buildTimer = null;
        this.timeRemaining = 30;
        
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
        this.resetUIState(); // Ensure consistent UI state on first load
        this.gameLoop();
    }

    // Volume control methods
    initializeVolume() {
        // Load saved volume from localStorage
        const savedVolume = localStorage.getItem('golfGameVolume');
        if (savedVolume !== null) {
            this.soundVolume = parseFloat(savedVolume);
        }
        
        // Update all audio elements with current volume
        this.updateAllAudioVolume();
        
        // Update volume sliders and displays
        this.updateVolumeUI();
    }
    
    updateAllAudioVolume() {
        const audioElements = [
            this.ballHitSound,
            this.waterSplashSound,
            this.holeSuccessSound,
            this.buttonClickSound
        ];
        
        audioElements.forEach(audio => {
            if (audio) {
                audio.volume = this.soundVolume;
            }
        });
    }
    
    updateVolumeUI() {
        // Update face-off mode volume slider
        const volumeSlider = document.getElementById('sound-volume');
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeSlider) {
            volumeSlider.value = Math.round(this.soundVolume * 100);
        }
        if (volumeDisplay) {
            volumeDisplay.textContent = `${Math.round(this.soundVolume * 100)}%`;
        }
        
        // Update courses mode volume slider
        const volumeSliderCourses = document.getElementById('sound-volume-courses');
        const volumeDisplayCourses = document.getElementById('volume-display-courses');
        if (volumeSliderCourses) {
            volumeSliderCourses.value = Math.round(this.soundVolume * 100);
        }
        if (volumeDisplayCourses) {
            volumeDisplayCourses.textContent = `${Math.round(this.soundVolume * 100)}%`;
        }
    }
    
    setVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.updateAllAudioVolume();
        this.updateVolumeUI();
        
        // Save to localStorage
        localStorage.setItem('golfGameVolume', this.soundVolume.toString());
    }

    // Sound methods
    playSound(audioElement) {
        if (audioElement && this.soundVolume > 0) {
            audioElement.currentTime = 0;
            audioElement.volume = this.soundVolume;
            audioElement.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playBallHitSound() {
        this.playSound(this.ballHitSound);
    }

    playWaterSplashSound() {
        this.playSound(this.waterSplashSound);
    }

    playHoleSuccessSound() {
        this.playSound(this.holeSuccessSound);
    }

    playButtonClickSound() {
        this.playSound(this.buttonClickSound);
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
                this.playButtonClickSound();
                this.startGame();
            });
        }

        // Done building button
        const doneBuildingBtn = document.getElementById('done-building-btn');
        if (doneBuildingBtn) {
            doneBuildingBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                this.nextPhase();
            });
        }

        // Show rules button
        const showRulesBtn = document.getElementById('show-rules-btn');
        if (showRulesBtn) {
            showRulesBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                this.showRules();
            });
        }

        // Close rules button
        const closeRulesBtn = document.getElementById('close-rules-btn');
        if (closeRulesBtn) {
            closeRulesBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                this.hideRules();
            });
        }

        // Close rules × button
        const closeRulesX = document.getElementById('close-rules');
        if (closeRulesX) {
            closeRulesX.addEventListener('click', () => {
                this.playButtonClickSound();
                this.hideRules();
            });
        }

        // Show settings button
        const showSettingsBtn = document.getElementById('show-settings-btn');
        if (showSettingsBtn) {
            showSettingsBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                this.showSettings();
            });
        }

        // Close settings button
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                this.hideSettings();
            });
        }

        // Close settings × button
        const closeSettingsX = document.getElementById('close-settings');
        if (closeSettingsX) {
            closeSettingsX.addEventListener('click', () => {
                this.playButtonClickSound();
                this.hideSettings();
            });
        }

        // Restart round button
        const restartRoundBtn = document.getElementById('restart-round-btn');
        if (restartRoundBtn) {
            restartRoundBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                // Stop current timer if running
                this.stopBuildTimer();
                this.resetHole();
                this.hideSettings();
                
                // Restart timer if enabled
                if (this.timerEnabled) {
                    this.startBuildTimer();
                }
            });
        }

        // Exit game button
        const exitGameBtn = document.getElementById('exit-game-btn');
        if (exitGameBtn) {
            exitGameBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                this.exitToMenu();
            });
        }

        // Face-off exit button
        const faceOffExitBtn = document.getElementById('face-off-exit-btn');
        if (faceOffExitBtn) {
            faceOffExitBtn.addEventListener('click', () => {
                this.playButtonClickSound();
                this.exitToMenu();
            });
        }

        // Play again button
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.playButtonClickSound();
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
                this.playButtonClickSound();
                this.gameMode = 'custom';
                customMode.classList.add('active');
                premadeMode.classList.remove('active');
                customSettings.style.display = 'block';
                premadeSettings.style.display = 'none';
            });
        }
        
        if (premadeMode) {
            premadeMode.addEventListener('click', () => {
                this.playButtonClickSound();
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
            
            // Touch event listeners for mobile support
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent scrolling/zooming
                this.handleTouchStart(e);
            });
            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault(); // Prevent scrolling/zooming
                this.handleTouchMove(e);
            });
            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault(); // Prevent scrolling/zooming
                this.handleTouchEnd(e);
            });
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
                this.playButtonClickSound();
                this.undoLastBuilding();
            });
        }

        // Delete button
        const deleteBtn = document.getElementById('delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.playButtonClickSound();
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

        // Hole count input validation
        const holeCountInput = document.getElementById('hole-count');
        if (holeCountInput) {
            holeCountInput.addEventListener('blur', (e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 1 || value > 18) {
                    e.target.value = 3;
                }
            });
            
            // Add step functionality for hole count
            holeCountInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    let value = parseInt(e.target.value) || 3;
                    value = Math.min(value + 1, 18);
                    e.target.value = value;
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    let value = parseInt(e.target.value) || 3;
                    value = Math.max(value - 1, 1);
                    e.target.value = value;
                }
            });
        }

        // Timer toggle and input
        const timerToggle = document.getElementById('timer-toggle');
        const timerSecondsInput = document.getElementById('timer-seconds');
        
        if (timerToggle) {
            timerToggle.addEventListener('change', (e) => {
                this.timerEnabled = e.target.checked;
                // Timer input is always visible now
            });
        }
        
        if (timerSecondsInput) {
            timerSecondsInput.addEventListener('input', (e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 5 || value > 300) {
                    e.target.value = 30;
                }
            });
            
            timerSecondsInput.addEventListener('blur', (e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 5 || value > 300) {
                    e.target.value = 30;
                }
            });
            
            // Add step functionality for timer seconds
            timerSecondsInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    let value = parseInt(e.target.value) || 30;
                    value = Math.min(value + 15, 300);
                    e.target.value = value;
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    let value = parseInt(e.target.value) || 30;
                    value = Math.max(value - 15, 5);
                    e.target.value = value;
                }
            });
        }

        // Courses exit button
        const coursesExitBtn = document.getElementById('courses-exit-btn');
        if (coursesExitBtn) {
            coursesExitBtn.addEventListener('click', () => {
                this.exitToMenu();
            });
        }

        // Sound volume sliders (Face Off and Courses modes)
        const volumeSlider = document.getElementById('sound-volume');
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.setVolume(value / 100);
            });
        }
        if (volumeDisplay) {
            volumeDisplay.textContent = `${Math.round(this.soundVolume * 100)}%`;
        }

        const volumeSliderCourses = document.getElementById('sound-volume-courses');
        const volumeDisplayCourses = document.getElementById('volume-display-courses');
        if (volumeSliderCourses) {
            volumeSliderCourses.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.setVolume(value / 100);
            });
        }
        if (volumeDisplayCourses) {
            volumeDisplayCourses.textContent = `${Math.round(this.soundVolume * 100)}%`;
        }
    }

    startGame() {
        if (this.gameMode === 'custom') {
            let holeCount = parseInt(document.getElementById('hole-count').value);
            if (isNaN(holeCount) || holeCount < 1 || holeCount > 18) {
                holeCount = 3;
                document.getElementById('hole-count').value = 3;
            }
            this.totalHoles = holeCount;
            
            // Read timer settings
            this.timerEnabled = document.getElementById('timer-toggle').checked;
            let timerSeconds = parseInt(document.getElementById('timer-seconds').value);
            if (isNaN(timerSeconds) || timerSeconds < 5 || timerSeconds > 300) {
                timerSeconds = 30;
                document.getElementById('timer-seconds').value = 30;
            }
            this.timerSeconds = timerSeconds;
            this.timeRemaining = timerSeconds;
            
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
            this.updateGameModeUI();
            
            // Start build timer if enabled
            if (this.timerEnabled) {
                this.startBuildTimer();
            }
            
            this.showMessage(`${this.getPlayerColor(this.currentPlayer)} building`);
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
            this.updateGameModeUI();
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

    updateGameModeUI() {
        const rulesBtn = document.getElementById('show-rules-btn');
        const restartRoundBtn = document.getElementById('restart-round-btn');
        const faceOffSettings = document.getElementById('face-off-settings');
        const coursesSettings = document.getElementById('courses-settings');
        const faceOffExitBtn = document.getElementById('face-off-exit-btn');
        const coursesExitBtn = document.getElementById('courses-exit-btn');
        
        if (this.gameMode === 'premade') {
            // In courses mode, hide rules button and restart round button
            if (rulesBtn) rulesBtn.style.display = 'none';
            if (restartRoundBtn) restartRoundBtn.style.display = 'none';
            if (faceOffSettings) faceOffSettings.style.display = 'none';
            if (coursesSettings) coursesSettings.style.display = 'block';
            if (faceOffExitBtn) faceOffExitBtn.style.display = 'none';
            if (coursesExitBtn) coursesExitBtn.style.display = 'block';
        } else {
            // In face off mode, show rules button and restart round button
            if (rulesBtn) rulesBtn.style.display = 'block';
            if (restartRoundBtn) restartRoundBtn.style.display = 'block';
            if (faceOffSettings) faceOffSettings.style.display = 'block';
            if (coursesSettings) coursesSettings.style.display = 'none';
            if (faceOffExitBtn) faceOffExitBtn.style.display = 'block';
            if (coursesExitBtn) coursesExitBtn.style.display = 'none';
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
        let terrainCount = 0;
        let wallCount = 0;
        
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
                
                // Assign z-index: terrain first (lower values), walls last (higher values)
                if (building.type === 'wall') {
                    building.zIndex = 1000 + wallCount; // Walls get high z-index
                    wallCount++;
                } else {
                    building.zIndex = terrainCount; // Terrain gets low z-index
                    terrainCount++;
                }
                
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
        console.log('⚔️ Face Off Hole JSON:');
        
        let wallsString = '';
        for (let i = 0; i < currentHoleData.walls.length; i++) {
            const wall = currentHoleData.walls[i];
            const comma = i < currentHoleData.walls.length - 1 ? ',' : '';
            wallsString += `{ type: "${wall.type}", x: ${wall.x}, y: ${wall.y}, width: ${wall.width}, height: ${wall.height}, rotation: ${wall.rotation} }${comma}`;
        }
        
        console.log(`{ name: ${currentHoleData.name}, ballPosition: { x: ${currentHoleData.ballPosition.x}, y: ${currentHoleData.ballPosition.y} }, holePosition: { x: ${currentHoleData.holePosition.x}, y: ${currentHoleData.holePosition.y} }, walls: [${wallsString}] }`);
        
        return currentHoleData;
    }

    rebuildCourseFromData() {
        // Store the current building data
        const buildingData = [];
        for (let building of this.walls) {
            buildingData.push({
                type: building.type,
                x: building.x,
                y: building.y,
                width: building.width,
                height: building.height,
                rotation: building.rotation || 0
            });
        }

        // Clear existing walls
        this.walls = [];

        // Recreate all buildings from the stored data
        for (let data of buildingData) {
            let building;
            switch (data.type) {
                case 'wall':
                    building = new Wall(data.x, data.y, data.width, data.height);
                    break;
                case 'sand':
                    building = new Sand(data.x, data.y, data.width, data.height);
                    break;
                case 'tallGrass':
                    building = new TallGrass(data.x, data.y, data.width, data.height);
                    break;
                case 'water':
                    building = new Water(data.x, data.y, data.width, data.height);
                    break;
                case 'ice':
                    building = new Ice(data.x, data.y, data.width, data.height);
                    break;
            }
            
            if (building) {
                // Set rotation if it exists
                if (data.rotation !== undefined) {
                    building.rotation = data.rotation;
                }
                
                // Set zIndex to maintain layering
                if (data.type === 'wall') {
                    building.zIndex = 1000; // Walls on top
                } else {
                    building.zIndex = 100; // Terrain below
                }
                
                this.walls.push(building);
            }
        }
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
                
                // Rebuild the course from coordinates to ensure proper collision detection
                this.rebuildCourseFromData();
                
                // Clear selection and hide rotation handle
                this.selectedBuilding = null;
                this.hideRotationHandle();
                
                // Hide build mode panel
                const buildModePanel = document.getElementById('build-mode-panel');
                if (buildModePanel) buildModePanel.style.display = 'none';
                
                // Stop build timer
                this.stopBuildTimer();
                
                this.showMessage(`${this.getPlayerColor(this.currentPlayer)} playing`);
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
                    
                    // Start build timer if enabled
                    if (this.timerEnabled) {
                        this.startBuildTimer();
                    }
                    
                    this.showMessage(`${this.getPlayerColor(this.currentPlayer)} building`);
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
        
        // Hide Red player score in single player mode
        const finalPlayer2Score = document.getElementById('final-player2-score');
        const finalPlayer2Label = document.querySelector('.final-score:nth-child(2)');
        if (this.gameMode === 'premade' && this.playerMode === 'single') {
            if (finalPlayer2Score) finalPlayer2Score.style.display = 'none';
            if (finalPlayer2Label) finalPlayer2Label.style.display = 'none';
        } else {
            if (finalPlayer2Score) finalPlayer2Score.style.display = 'inline';
            if (finalPlayer2Label) finalPlayer2Label.style.display = 'flex';
        }
        
        // Determine winner
        let winnerText = '';
        if (this.gameMode === 'premade' && this.playerMode === 'single') {
            // Single player mode - just show completion
            winnerText = `Course Complete!`;
        } else if (this.player1Score < this.player2Score) {
            winnerText = 'Blue wins! 🏆';
        } else if (this.player2Score < this.player1Score) {
            winnerText = 'Red wins! 🏆';
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
                        this.isHoleOrBallWithinBoundaries(x - this.hole.radius, y - this.hole.radius, this.hole.radius * 2, this.hole.radius * 2)) {
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
                        this.isHoleOrBallWithinBoundaries(x - this.ball.radius, y - this.ball.radius, this.ball.radius * 2, this.ball.radius * 2)) {
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
            
            // Ensure walls always appear on top of other elements
            if (this.movingBuilding.type === 'wall') {
                // Walls get the highest zIndex (always on top)
                const maxZIndex = this.walls.length > 0 ? Math.max(...this.walls.map(b => b.zIndex)) : 999;
                this.movingBuilding.zIndex = maxZIndex + 1;
            } else {
                // For non-wall buildings, bring them to the top of their category
                const sameTypeBuildings = this.walls.filter(b => b.type === this.movingBuilding.type);
                const maxSameTypeZIndex = sameTypeBuildings.length > 0 ? Math.max(...sameTypeBuildings.map(b => b.zIndex)) : 0;
                this.movingBuilding.zIndex = maxSameTypeZIndex + 1;
            }
            
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
                if (false) { // Removed boundary checking - buildings can extend beyond boundaries
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
                if (false) { // Removed boundary checking - buildings can extend beyond boundaries
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

    // Touch event handlers for mobile support
    handleTouchStart(e) {
        if (e.touches.length === 0) return;
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Handle rotation
        if (this.isRotating) {
            this.updateRotationFromTouch(touch);
            return;
        }

        if (this.currentPhase === PHASES.PLAY && !this.ball.isMoving && !this.ball.isWaitingForWaterCheck) {
            // Check if touching on ball
            if (this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius) {
                this.isDragging = true;
                this.dragStart = new Vector2D(x, y);
                this.dragEnd = new Vector2D(x, y);
                this.showTrajectory = true;
            }
        } else if (this.currentPhase === PHASES.DESIGN) {
            // Check if touching on hole (only if hole is movable)
            if (this.holeMovable && this.hole.position.distance(new Vector2D(x, y)) < this.hole.radius) {
                this.isDragging = true;
                this.dragStart = new Vector2D(x, y);
                this.dragEnd = new Vector2D(x, y);
                this.draggingObject = 'hole';
                return;
            }
            
            // Check if touching on ball (only if ball is movable)
            if (this.ballMovable && this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius) {
                this.isDragging = true;
                this.dragStart = new Vector2D(x, y);
                this.dragEnd = new Vector2D(x, y);
                this.draggingObject = 'ball';
                return;
            }
            
            // Check if touching on existing building
            const touchedBuilding = this.getBuildingAtPosition(x, y);
            
            if (touchedBuilding) {
                // Select the building for potential deletion and rotation
                this.selectedBuilding = touchedBuilding;
                this.showRotationHandle(touchedBuilding);
                
                // Start moving existing building
                this.isMovingBuilding = true;
                this.movingBuilding = touchedBuilding;
                this.movingBuildingOffset = new Vector2D(x - touchedBuilding.x, y - touchedBuilding.y);
                
                // Store original position for collision reset
                this.movingBuildingOriginalPosition = {
                    x: touchedBuilding.x,
                    y: touchedBuilding.y,
                    rotation: touchedBuilding.rotation
                };
            } else {
                // Touching on empty space - clear selection and start building new
                if (this.selectedBuilding) {
                    // Clear selection when touching off a building
                    this.selectedBuilding = null;
                    this.hideRotationHandle();
                }
                
                // Start building if touching on empty space
                const touchingOnHole = this.hole.position.distance(new Vector2D(x, y)) < this.hole.radius;
                const touchingOnBall = this.ball.position.distance(new Vector2D(x, y)) < this.ball.radius;
                
                if (!touchingOnHole && !touchingOnBall) {
                    this.isBuilding = true;
                    this.buildStart = new Vector2D(x, y);
                    this.buildEnd = new Vector2D(x, y);
                }
            }
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 0) return;
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Handle rotation
        if (this.isRotating) {
            this.updateRotationFromTouch(touch);
            return;
        }

        // Update cursor based on phase and position (for visual feedback)
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

        if (this.isDragging) {
            this.dragEnd = new Vector2D(x, y);
            
            // Update object position if dragging in design mode
            if (this.currentPhase === PHASES.DESIGN && this.draggingObject) {
                if (this.draggingObject === 'hole' && this.holeMovable) {
                    // Check if new position would overlap with ball, buildings, and is within boundaries
                    const newHolePos = new Vector2D(x, y);
                    if (!this.holeOverlapsBall(newHolePos, this.ball) && 
                        !this.holeOverlapsBuildings(newHolePos) && 
                        this.isHoleOrBallWithinBoundaries(x - this.hole.radius, y - this.hole.radius, this.hole.radius * 2, this.hole.radius * 2)) {
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
                        this.isHoleOrBallWithinBoundaries(x - this.ball.radius, y - this.ball.radius, this.ball.radius * 2, this.ball.radius * 2)) {
                        this.ball.position = newBallPos;
                        // Update spawn position when ball is moved during design
                        this.spawnPosition = new Vector2D(x, y);
                    }
                }
            }
        } else if (this.isBuilding) {
            // Update building end position for size adjustment
            this.buildEnd = new Vector2D(x, y);
            
            // Calculate building dimensions
            const startX = Math.min(this.buildStart.x, this.buildEnd.x);
            const startY = Math.min(this.buildStart.y, this.buildEnd.y);
            const endX = Math.max(this.buildStart.x, this.buildEnd.x);
            const endY = Math.max(this.buildStart.y, this.buildEnd.y);
            const width = endX - startX;
            const height = endY - startY;
            
            // Only show preview if building is large enough
            if (width >= 10 && height >= 10) {
                // The preview will be drawn in the draw() method since isBuilding is true
                // This ensures the building preview is visible while dragging
            }
        } else if (this.isMovingBuilding && this.movingBuilding) {
            // Calculate new position
            const newX = x - this.movingBuildingOffset.x;
            const newY = y - this.movingBuildingOffset.y;
            
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
            
            // Ensure walls always appear on top of other elements
            if (this.movingBuilding.type === 'wall') {
                // Walls get the highest zIndex (always on top)
                const maxZIndex = this.walls.length > 0 ? Math.max(...this.walls.map(b => b.zIndex)) : 999;
                this.movingBuilding.zIndex = maxZIndex + 1;
            } else {
                // For non-wall buildings, bring them to the top of their category
                const sameTypeBuildings = this.walls.filter(b => b.type === this.movingBuilding.type);
                const maxSameTypeZIndex = sameTypeBuildings.length > 0 ? Math.max(...sameTypeBuildings.map(b => b.zIndex)) : 0;
                this.movingBuilding.zIndex = maxSameTypeZIndex + 1;
            }
            
            // Update rotation handle position if building is selected
            if (this.selectedBuilding === this.movingBuilding) {
                this.showRotationHandle(this.movingBuilding);
            }
        }
        
        if (this.isRotating && this.selectedBuilding) {
            this.updateRotationFromTouch(touch);
        }
    }

    handleTouchEnd(e) {
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
            // Calculate final building dimensions
            const startX = Math.min(this.buildStart.x, this.buildEnd.x);
            const startY = Math.min(this.buildStart.y, this.buildEnd.y);
            const endX = Math.max(this.buildStart.x, this.buildEnd.x);
            const endY = Math.max(this.buildStart.y, this.buildEnd.y);
            const width = endX - startX;
            const height = endY - startY;
            
            // Only place building if it meets minimum size requirements
            if (width >= 10 && height >= 10) {
                this.placeBuilding();
            }
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
                if (false) { // Removed boundary checking - buildings can extend beyond boundaries
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

    updateRotationFromTouch(touch) {
        if (!this.selectedBuilding || !this.isRotating) return;
        
        const canvasRect = this.canvas.getBoundingClientRect();
        const centerX = this.selectedBuilding.x + this.selectedBuilding.width / 2;
        const centerY = this.selectedBuilding.y + this.selectedBuilding.height / 2;
        
        const touchX = touch.clientX - canvasRect.left;
        const touchY = touch.clientY - canvasRect.top;
        
        const angle = Math.atan2(touchY - centerY, touchX - centerX) * 180 / Math.PI;
        this.selectedBuilding.rotation = angle;
        
        // Update rotation handle position
        this.showRotationHandle(this.selectedBuilding);
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
        // Only count a stroke if the velocity is significant
        if (!velocity || velocity.magnitude() < MIN_VELOCITY) {
            // Do not count as a stroke, do not move the ball
            return;
        }
        // Store the ball's current position before taking the shot
        this.ball.lastPosition = new Vector2D(this.ball.position.x, this.ball.position.y);
        
        this.ball.velocity = velocity;
        this.ball.isMoving = true;
        
        // Play ball hit sound
        this.playBallHitSound();
        
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
        
        // Play water splash sound
        this.playWaterSplashSound();
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
            
            // Play hole success sound
            this.playHoleSuccessSound();
            
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
                    this.showMessage(`${completingPlayerName} completed hole ${this.currentHole}. Now ${nextPlayerName} gets their turn.`);
                    
                    // Spawn the next player's ball after confetti and delay
                    setTimeout(() => {
                        this.ball.reset(this.spawnPosition.x, this.spawnPosition.y);
                        this.updateBallColor();
                        this.showMessage(`${nextPlayerName} is now playing.`);
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
                    this.showMessage(`${completingPlayerName} completed hole ${this.currentHole}. Now ${nextPlayerName} gets their turn.`);
                    
                    // Spawn the next player's ball after confetti and delay
                    setTimeout(() => {
                        this.ball.reset(this.spawnPosition.x, this.spawnPosition.y);
                        this.updateBallColor();
                        this.showMessage(`${nextPlayerName} is now playing.`);
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
        this.ctx.fillStyle = '#a2d149'; // Light green grass color
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw terrain first (water, sand, tall grass, ice)
        const terrainBuildings = this.walls.filter(building => building.type !== 'wall');
        const sortedTerrain = [...terrainBuildings].sort((a, b) => a.zIndex - b.zIndex);
        for (let building of sortedTerrain) {
            building.draw(this.ctx);
        }
        
        // Draw placed walls above terrain but below boundary walls
        const wallBuildings = this.walls.filter(building => building.type === 'wall');
        const sortedWalls = [...wallBuildings].sort((a, b) => a.zIndex - b.zIndex);
        for (let building of sortedWalls) {
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
        
        // Draw boundary walls above everything except UI elements
        for (let wall of this.boundaryWalls) {
            wall.draw(this.ctx);
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
        
        // Draw trajectory if dragging (draw last to ensure it's on top of everything)
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
            
            // Set blend mode to ensure dots are visible above everything
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
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.globalAlpha = 1.0;
                this.ctx.fillStyle = '#FF0000';
                this.ctx.font = '20px Arial';
                this.ctx.fillText(`Power Level: ${Math.round(power * 100)}`, 10, 30);
                this.ctx.restore();
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

    isHoleOrBallWithinBoundaries(x, y, width = 0, height = 0) {
        // Only hole and ball need to stay within boundaries
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

    startBuildTimer() {
        if (!this.timerEnabled) return;
        
        this.timeRemaining = this.timerSeconds;
        this.updateTimerDisplay();
        
        const buildTimer = document.getElementById('build-timer');
        if (buildTimer) {
            buildTimer.style.display = 'flex';
        }
        
        this.buildTimer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.stopBuildTimer();
                this.nextPhase(); // Auto-complete the design phase
            }
        }, 1000);
    }

    stopBuildTimer() {
        if (this.buildTimer) {
            clearInterval(this.buildTimer);
            this.buildTimer = null;
        }
        
        const buildTimer = document.getElementById('build-timer');
        if (buildTimer) {
            buildTimer.style.display = 'none';
        }
    }

    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timer-display');
        const buildTimer = document.getElementById('build-timer');
        
        if (timerDisplay) {
            timerDisplay.textContent = this.timeRemaining;
        }
        
        if (buildTimer) {
            if (this.timeRemaining <= 5) {
                buildTimer.classList.add('warning');
            } else {
                buildTimer.classList.remove('warning');
            }
        }
    }

    exitToMenu() {
        // Stop any running timers
        this.stopBuildTimer();
        
        // Reset game state
        this.currentState = GAME_STATES.START;
        this.gameMode = 'custom';
        this.playerMode = 'multiplayer';
        this.selectedCourse = 'beginner';
        
        // Reset UI
        this.resetUIState();
        
        // Hide settings modal
        this.hideSettings();
    }

    resetUIState() {
        const gameScreen = document.getElementById('game-screen');
        const winScreen = document.getElementById('win-screen');
        const startScreen = document.getElementById('start-screen');
        const buildModePanel = document.getElementById('build-mode-panel');
        
        if (gameScreen) gameScreen.style.display = 'none';
        if (winScreen) winScreen.style.display = 'none';
        if (startScreen) startScreen.style.display = 'block';
        if (buildModePanel) buildModePanel.style.display = 'none';
        
        // Reset mode selection UI
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
        
        // Reset form values
        const holeCountInput = document.getElementById('hole-count');
        const timerToggle = document.getElementById('timer-toggle');
        const timerSecondsInput = document.getElementById('timer-seconds');
        const courseSelect = document.getElementById('course-select');
        const playerModeSelect = document.getElementById('player-mode');
        
        if (holeCountInput) holeCountInput.value = '3';
        if (timerToggle) timerToggle.checked = false;
        if (timerSecondsInput) {
            timerSecondsInput.value = '30';
        }
        if (courseSelect) courseSelect.value = 'beginner';
        if (playerModeSelect) playerModeSelect.value = 'multiplayer';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GolfGame();
}); 