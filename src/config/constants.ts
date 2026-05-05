export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;
export const BALL_RADIUS = 8;
export const HOLE_RADIUS = 12;
export const WALL_THICKNESS = 10;

export const FRICTION = 0.96;
export const SAND_FRICTION = 0.75;
export const TALL_GRASS_FRICTION = 0.88;
export const ICE_FRICTION = 0.995;
export const WATER_FRICTION = 0.8;

export const MIN_VELOCITY = 0.05;
export const MAX_VELOCITY = 1.5;
export const HOLE_DETECTION_THRESHOLD = 0.3;

export const WALL_RESTITUTION = 0.8;
export const POWER_MULTIPLIER = 0.012;
export const SUB_STEP_FACTOR = 0.5;

export const PLAYER1_COLOR = '#4169E1';
export const PLAYER2_COLOR = '#DC143C';

export const GRASS_COLOR = '#a2d149';

export const HITBOX_PADDING = 3;

export const AIM_LINE_MAX_LENGTH = 80;
export const AIM_DOT_SPACING = 8;
export const AIM_DOT_COLOR = '#FFFFFF';
export const AIM_DOT_OUTLINE = '#CCCCCC';

export const SELECTION_OUTLINE_COLOR = '#FFD700';
export const SELECTION_OUTLINE_WIDTH = 3;

export const CONFETTI_COUNT = 30;
export const CONFETTI_COLORS = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#32CD32'];
export const CONFETTI_GRAVITY = 0.1;
export const CONFETTI_LIFETIME_MS = 2000;

export const TIMER_DEFAULT = 30;
export const TIMER_MIN = 5;
export const TIMER_MAX = 300;
export const TIMER_STEP = 15;
export const TIMER_WARNING_THRESHOLD = 5;

export const HOLE_COUNT_DEFAULT = 3;
export const HOLE_COUNT_MIN = 1;
export const HOLE_COUNT_MAX = 18;

export const DEFAULT_VOLUME = 0.7;
export const VOLUME_STORAGE_KEY = 'golfGameVolume';

export const MIN_BUILDING_SIZE = 10;

// Buildings can extend up to ±3x canvas dimensions, centered.
// Canvas 800x400 -> x: [-800, 1600], y: [-400, 800]
export const BUILD_BOUNDS = {
  minX: -CANVAS_WIDTH,
  maxX: CANVAS_WIDTH * 2,
  minY: -CANVAS_HEIGHT,
  maxY: CANVAS_HEIGHT * 2,
};

export const WALL_Z_INDEX_BASE = 1000;
