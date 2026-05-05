import { Vector2D } from './Vector2D';
import { StateMachine, GAME_STATES, PHASES } from './StateMachine';
import { HoleProgression } from './HoleProgression';
import type { GameMode, PlayerMode, CourseId, TileType } from './types';

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FRICTION,
  SAND_FRICTION,
  TALL_GRASS_FRICTION,
  ICE_FRICTION,
  WATER_FRICTION,
  WALL_RESTITUTION,
  PLAYER1_COLOR,
  PLAYER2_COLOR,
  HOLE_COUNT_DEFAULT,
  TIMER_DEFAULT,
  BUILD_BOUNDS,
  MIN_BUILDING_SIZE,
} from '../config/constants';
import { PREMADE_COURSES } from '../config/courses';

import { Ball } from '../physics/Ball';
import { Hole } from '../entities/Hole';
import { stepBall } from '../physics/stepper';
import { reflectVelocity } from '../physics/collisions';
import { createBoundaryWalls } from '../entities/boundary';
import type { Wall } from '../entities/buildings/Wall';
import type { Building } from '../entities/buildings/Building';
import { Wall as WallCls } from '../entities/buildings/Wall';
import { Sand } from '../entities/buildings/Sand';
import { TallGrass } from '../entities/buildings/TallGrass';
import { Water } from '../entities/buildings/Water';
import { Ice } from '../entities/buildings/Ice';

import { ConfettiSystem } from '../effects/Confetti';

import { AudioManager } from '../audio/AudioManager';
import { Screens } from '../ui/Screens';
import { Message } from '../ui/Message';
import { ScoreSheet } from '../ui/ScoreSheet';
import { Timer } from '../ui/Timer';
import { BuildPanel } from '../ui/BuildPanel';
import { RulesModal } from '../ui/modals/RulesModal';
import { SettingsModal } from '../ui/modals/SettingsModal';

import { DesignMode } from '../design/DesignMode';
import { Renderer } from '../render/Renderer';
import type { PreviewState, AimState } from '../render/Renderer';

import { PointerInput } from '../input/PointerInput';
import { KeyboardInput } from '../input/KeyboardInput';
import { setCursor } from '../input/cursor';

import { TurnManager } from '../play/TurnManager';
import { computeAim } from '../play/Aiming';
import { shootBall } from '../play/Shooting';

import {
  rectOverlapsBall,
  holeOverlapsBall,
  holeOverlapsBuildings,
  ballOverlapsBuildings,
  isWithinPlayBoundaries,
} from '../design/build/placementRules';
import { rectOverlapsHole } from '../design/build/Placement';

export class Game {
  // DOM
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Core
  private state = new StateMachine();
  private progression = new HoleProgression();
  private turn = new TurnManager();

  // Settings
  private gameMode: GameMode = 'custom';
  private playerMode: PlayerMode = 'multiplayer';
  private courseId: CourseId = 'test';
  private timerEnabled = false;
  private timerSeconds = TIMER_DEFAULT;

  // Entities
  private ball: Ball;
  private hole: Hole;
  private boundaryWalls: Wall[];
  private walls: Building[] = [];
  private confetti = new ConfettiSystem();

  // Subsystems
  private audio: AudioManager;
  private screens = new Screens();
  private message = new Message();
  private scoreSheet = new ScoreSheet();
  private buildTimer = new Timer();
  private buildPanel: BuildPanel;
  private rules: RulesModal;
  private settings: SettingsModal;
  private design: DesignMode;
  private renderer: Renderer;

  // Pointer / aim / build state
  private isAiming = false;
  private aimStart = new Vector2D(0, 0);
  private aimEnd = new Vector2D(0, 0);
  private isMovingBall = false;
  private isMovingHole = false;
  private moveOffset = new Vector2D(0, 0);

  // Pending hole-success transition
  private holeAdvanceScheduled = false;

  constructor() {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
    if (!canvas) throw new Error('game-canvas not found');
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not available');
    this.ctx = ctx;

    this.audio = new AudioManager();

    // Entities
    this.ball = new Ball(100, CANVAS_HEIGHT / 2, PLAYER1_COLOR);
    this.hole = new Hole(CANVAS_WIDTH - 100, CANVAS_HEIGHT / 2);
    this.boundaryWalls = createBoundaryWalls();

    // Design wraps build mode
    this.design = new DesignMode(this.walls, this.canvas);
    this.renderer = new Renderer(this.ctx);

    this.buildPanel = new BuildPanel({
      onSelectType: (t) => {
        this.audio.play('click');
        this.design.build.currentType = t;
        this.buildPanel.setActive(t);
      },
      onUndo: () => {
        this.audio.play('click');
        this.design.build.undoLast();
      },
      onDelete: () => {
        this.audio.play('click');
        this.design.build.deleteSelected();
        this.design.rotation.hide();
      },
      onDone: () => {
        this.audio.play('click');
        this.finishDesignPhase();
      },
    });

    this.rules = new RulesModal(() => this.audio.play('click'));
    this.settings = new SettingsModal(this.audio, {
      onClick: () => this.audio.play('click'),
      onRestartHole: () => this.restartHole(),
      onExitToMenu: () => this.exitToMenu(),
    });

    // Wire start screen
    this.wireStartScreen();
    // Wire game-screen rules/settings buttons
    document.getElementById('show-rules-btn')?.addEventListener('click', () => {
      this.audio.play('click');
      this.rules.show();
    });
    document.getElementById('show-settings-btn')?.addEventListener('click', () => {
      this.audio.play('click');
      this.settings.updateModeUI(this.gameMode);
      this.settings.show();
    });
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
      this.audio.play('click');
      this.exitToMenu();
    });

    // Inputs
    new PointerInput(this.canvas, {
      onDown: (p) => this.onPointerDown(p),
      onMove: (p) => this.onPointerMove(p),
      onUp: (p) => this.onPointerUp(p),
      onGlobalMove: (p) => this.onGlobalPointerMove(p),
      onGlobalUp: (p) => this.onGlobalPointerUp(p),
    });

    new KeyboardInput({
      onDelete: () => {
        if (this.state.state === GAME_STATES.DESIGN) {
          this.design.build.deleteSelected();
          this.design.rotation.hide();
        }
      },
    });

    // Start render loop
    this.screens.show('start');
    requestAnimationFrame(() => this.loop());
  }

  // ---------- Start screen ----------
  private wireStartScreen(): void {
    const customMode = document.getElementById('custom-mode');
    const premadeMode = document.getElementById('premade-mode');
    const customSettings = document.getElementById('custom-settings');
    const premadeSettings = document.getElementById('premade-settings');

    customMode?.addEventListener('click', () => {
      this.audio.play('click');
      this.gameMode = 'custom';
      customMode.classList.add('active');
      premadeMode?.classList.remove('active');
      if (customSettings) customSettings.style.display = 'block';
      if (premadeSettings) premadeSettings.style.display = 'none';
    });
    premadeMode?.addEventListener('click', () => {
      this.audio.play('click');
      this.gameMode = 'premade';
      premadeMode.classList.add('active');
      customMode?.classList.remove('active');
      if (customSettings) customSettings.style.display = 'none';
      if (premadeSettings) premadeSettings.style.display = 'block';
    });

    document.getElementById('start-game-btn')?.addEventListener('click', () => {
      this.audio.play('click');
      this.startGame();
    });
  }

  private startGame(): void {
    if (this.gameMode === 'custom') {
      const holeInput = document.getElementById('hole-count') as HTMLInputElement | null;
      const timerToggle = document.getElementById('timer-toggle') as HTMLInputElement | null;
      const timerSecondsInput = document.getElementById('timer-seconds') as HTMLInputElement | null;
      const totalHoles = parseInt(holeInput?.value || String(HOLE_COUNT_DEFAULT), 10) || HOLE_COUNT_DEFAULT;
      this.timerEnabled = !!timerToggle?.checked;
      this.timerSeconds = parseInt(timerSecondsInput?.value || String(TIMER_DEFAULT), 10) || TIMER_DEFAULT;
      this.progression.reset(totalHoles);
      this.turn.resetAll();
      this.walls = [];
      this.design.setWalls(this.walls);
      this.confetti.active = false;
      this.holeAdvanceScheduled = false;

      this.screens.show('game');
      this.applyRulesButtonVisibility();
      this.beginDesignPhase();
    } else {
      const courseSel = document.getElementById('course-select') as HTMLSelectElement | null;
      const playerModeSel = document.getElementById('player-mode') as HTMLSelectElement | null;
      this.courseId = (courseSel?.value as CourseId) || 'beginner';
      this.playerMode = (playerModeSel?.value as PlayerMode) || 'single';
      const course = PREMADE_COURSES[this.courseId];
      this.progression.reset(course.holes);
      this.turn.resetAll();
      this.confetti.active = false;
      this.holeAdvanceScheduled = false;

      this.screens.show('game');
      this.applyRulesButtonVisibility();
      this.loadPremadeHole();
      this.beginPlayPhase();
    }
  }

  private applyRulesButtonVisibility(): void {
    const rulesBtn = document.getElementById('show-rules-btn');
    if (rulesBtn) rulesBtn.style.display = this.gameMode === 'custom' ? '' : 'none';
  }

  // ---------- Phase transitions ----------
  private beginDesignPhase(): void {
    this.state.setState(GAME_STATES.DESIGN);
    this.state.setPhase(PHASES.DESIGN);
    this.screens.setBuildPanelVisible(true);
    this.design.ballMovable = true;
    this.design.holeMovable = true;
    this.design.clearSelection();
    this.design.build.currentType = 'wall';
    this.buildPanel.setActive('wall');

    // Reset ball/hole defaults for the new design
    const designer = this.turn.currentPlayer;
    const opponentColor = designer === 1 ? PLAYER2_COLOR : PLAYER1_COLOR;
    this.ball.color = opponentColor;
    this.ball.reset(100, CANVAS_HEIGHT / 2);
    this.hole.position = new Vector2D(CANVAS_WIDTH - 100, CANVAS_HEIGHT / 2);

    this.message.show(`Player ${designer === 1 ? 'Blue' : 'Red'}: Design hole ${this.progression.currentHole}`);

    if (this.timerEnabled) {
      this.buildTimer.start(this.timerSeconds, () => this.finishDesignPhase());
    } else {
      this.buildTimer.stop();
    }
    this.updateScoreUI();
  }

  private finishDesignPhase(): void {
    this.buildTimer.stop();
    this.design.clearSelection();
    this.beginPlayPhase();
  }

  private beginPlayPhase(): void {
    this.state.setState(GAME_STATES.PLAY);
    this.state.setPhase(PHASES.PLAY);
    this.screens.setBuildPanelVisible(false);

    this.turn.resetHoleScores();
    // Determine designer (the one who just designed); the OTHER player plays first
    if (this.gameMode === 'custom') {
      // designer is current; switch to other for play
      this.turn.currentPlayer = this.turn.currentPlayer === 1 ? 2 : 1;
    } else if (this.playerMode === 'multiplayer') {
      this.turn.currentPlayer = 1;
    } else {
      this.turn.currentPlayer = 1;
    }
    this.updateBallColor();
    this.ball.respawn();
    this.holeAdvanceScheduled = false;
    this.message.show(`${TurnManager.playerName(this.turn.currentPlayer)}'s turn`);
    this.updateScoreUI();
  }

  private loadPremadeHole(): void {
    const course = PREMADE_COURSES[this.courseId];
    const idx = this.progression.currentHole - 1;
    const holeData = course.courses[idx];
    if (!holeData) return;
    this.walls = holeData.walls.map((w) => this.makeBuildingFromType(w.type, w.x, w.y, w.width, w.height, w.rotation));
    // Assign zIndex by category order
    let zWall = 1000;
    let zNon = 0;
    for (const b of this.walls) {
      if (b.type === 'wall') b.zIndex = zWall++;
      else b.zIndex = zNon++;
    }
    this.design.setWalls(this.walls);
    this.ball.reset(holeData.ballPosition.x, holeData.ballPosition.y);
    this.hole.position = new Vector2D(holeData.holePosition.x, holeData.holePosition.y);
  }

  private makeBuildingFromType(type: TileType, x: number, y: number, w: number, h: number, rotation: number): Building {
    let b: Building;
    switch (type) {
      case 'wall': b = new WallCls(x, y, w, h); break;
      case 'sand': b = new Sand(x, y, w, h); break;
      case 'tallGrass': b = new TallGrass(x, y, w, h); break;
      case 'water': b = new Water(x, y, w, h); break;
      case 'ice': b = new Ice(x, y, w, h); break;
    }
    b.rotation = rotation;
    return b;
  }

  private restartHole(): void {
    this.confetti.active = false;
    this.holeAdvanceScheduled = false;
    if (this.gameMode === 'custom') {
      // Start hole over from design (same designer)
      this.walls = [];
      this.design.setWalls(this.walls);
      this.beginDesignPhase();
    } else {
      this.turn.resetHoleScores();
      this.loadPremadeHole();
      this.beginPlayPhase();
    }
  }

  private nextPhase(): void {
    this.turn.commitHole();
    if (this.progression.advance()) {
      this.endGame();
      return;
    }
    if (this.gameMode === 'custom') {
      // Switch designer for next hole
      this.turn.currentPlayer = this.turn.currentPlayer === 1 ? 2 : 1;
      this.walls = [];
      this.design.setWalls(this.walls);
      this.beginDesignPhase();
    } else {
      this.loadPremadeHole();
      this.beginPlayPhase();
    }
  }

  private endGame(): void {
    this.state.setState(GAME_STATES.WIN);
    this.buildTimer.stop();
    const p1 = this.turn.player1Score;
    const p2 = this.turn.player2Score;
    const isSinglePlayer = this.gameMode === 'premade' && this.playerMode === 'single';

    const finalP1 = document.getElementById('final-player1-score');
    const finalP2 = document.getElementById('final-player2-score');
    if (finalP1) finalP1.textContent = String(p1);
    if (finalP2) finalP2.textContent = String(p2);

    const player2Row = finalP2?.parentElement;
    if (player2Row) player2Row.style.display = isSinglePlayer ? 'none' : '';

    const winnerText = document.getElementById('winner-text');
    if (winnerText) {
      if (isSinglePlayer) {
        winnerText.textContent = 'Course Completed!';
      } else if (p1 < p2) winnerText.textContent = 'Blue wins!';
      else if (p2 < p1) winnerText.textContent = 'Red wins!';
      else winnerText.textContent = "It's a tie!";
    }
    this.screens.show('win');
  }

  private exitToMenu(): void {
    this.buildTimer.stop();
    this.confetti.active = false;
    this.holeAdvanceScheduled = false;
    this.state.setState(GAME_STATES.START);
    this.walls = [];
    this.design.setWalls(this.walls);
    this.design.clearSelection();
    this.screens.setBuildPanelVisible(false);
    this.screens.show('start');
  }

  // ---------- UI ----------
  private updateScoreUI(): void {
    this.scoreSheet.update({
      currentHole: this.progression.currentHole,
      totalHoles: this.progression.totalHoles,
      player1HoleScore: this.turn.player1HoleScore,
      player2HoleScore: this.turn.player2HoleScore,
      player1Score: this.turn.player1Score,
      player2Score: this.turn.player2Score,
      gameMode: this.gameMode,
      playerMode: this.playerMode,
    });
  }

  private updateBallColor(): void {
    if (this.gameMode === 'premade' && this.playerMode === 'single') {
      this.ball.color = PLAYER1_COLOR;
      return;
    }
    this.ball.color = this.turn.currentPlayer === 1 ? PLAYER1_COLOR : PLAYER2_COLOR;
  }

  // ---------- Pointer routing ----------
  private onPointerDown(p: Vector2D): void {
    if (this.state.state === GAME_STATES.DESIGN) this.designDown(p);
    else if (this.state.state === GAME_STATES.PLAY) this.playDown(p);
  }

  private onPointerMove(p: Vector2D): void {
    this.updateCursor(p);
  }

  private onPointerUp(p: Vector2D): void {
    if (this.state.state === GAME_STATES.DESIGN) this.designUp(p);
    else if (this.state.state === GAME_STATES.PLAY) this.playUp(p);
  }

  private onGlobalPointerMove(p: Vector2D): void {
    if (this.state.state === GAME_STATES.DESIGN) {
      // Continue building/moving even outside canvas
      if (this.design.build.isBuilding) this.design.build.updateBuild(p);
      else if (this.design.build.isMovingBuilding) this.design.build.updateMove(p);
      else if (this.isMovingBall) this.tryMoveBall(p);
      else if (this.isMovingHole) this.tryMoveHole(p);
      else if (this.design.rotation.isRotating && this.design.rotation.target) {
        this.design.rotation.rotateTo(this.design.rotation.target, p.x, p.y);
      }
    } else if (this.state.state === GAME_STATES.PLAY && this.isAiming) {
      this.aimEnd = p.clone();
    }
  }

  private onGlobalPointerUp(_p: Vector2D): void {
    if (this.state.state === GAME_STATES.DESIGN) {
      if (this.design.build.isBuilding) {
        const placed = this.design.build.finishBuild(this.ball, this.hole);
        if (!placed) this.design.build.cancelBuild();
      }
      if (this.design.build.isMovingBuilding) {
        // Validate move; if invalid (overlaps ball/hole/out of bounds) revert
        const b = this.design.build.movingBuilding;
        if (b) {
          if (this.invalidPlacement(b)) {
            // Revert to last valid (just clamp inside bounds)
            b.x = Math.max(BUILD_BOUNDS.minX, Math.min(b.x, BUILD_BOUNDS.maxX - b.width));
            b.y = Math.max(BUILD_BOUNDS.minY, Math.min(b.y, BUILD_BOUNDS.maxY - b.height));
          }
          this.design.rotation.show(b);
        }
        this.design.build.endMove();
      }
      if (this.design.rotation.isRotating) {
        this.design.rotation.endRotation();
      }
      this.isMovingBall = false;
      this.isMovingHole = false;
    } else if (this.state.state === GAME_STATES.PLAY && this.isAiming) {
      this.shoot();
    }
  }

  // ---------- Design pointer ----------
  private designDown(p: Vector2D): void {
    // Check ball click
    if (this.design.ballMovable && p.distance(this.ball.position) < this.ball.radius + 5) {
      this.isMovingBall = true;
      this.moveOffset = new Vector2D(p.x - this.ball.position.x, p.y - this.ball.position.y);
      this.design.clearSelection();
      return;
    }
    // Check hole click
    if (this.design.holeMovable && p.distance(this.hole.position) < this.hole.radius + 5) {
      this.isMovingHole = true;
      this.moveOffset = new Vector2D(p.x - this.hole.position.x, p.y - this.hole.position.y);
      this.design.clearSelection();
      return;
    }
    // Check building click (topmost wins)
    const hit = this.design.build.buildingAt(p.x, p.y);
    if (hit) {
      this.design.selectBuilding(hit);
      this.design.build.beginMove(hit, p);
      return;
    }
    // Otherwise begin building
    this.design.clearSelection();
    if (isWithinPlayBoundaries(p.x, p.y) || (p.x >= BUILD_BOUNDS.minX && p.x <= BUILD_BOUNDS.maxX && p.y >= BUILD_BOUNDS.minY && p.y <= BUILD_BOUNDS.maxY)) {
      this.design.build.beginBuild(p);
    }
  }

  private designUp(_p: Vector2D): void {
    // handled in global up
  }

  private tryMoveBall(p: Vector2D): void {
    const nx = p.x - this.moveOffset.x;
    const ny = p.y - this.moveOffset.y;
    if (!isWithinPlayBoundaries(nx, ny)) return;
    const candidate = new Vector2D(nx, ny);
    if (holeOverlapsBall(this.hole.position, this.ball, this.hole.radius)) {
      // checked AFTER move would be applied - simulate
    }
    // Simulate then check
    const old = this.ball.position;
    this.ball.position = candidate;
    const overlapsHole = this.hole.position.distance(this.ball.position) < (this.hole.radius + this.ball.radius);
    const overlapsBuildings = ballOverlapsBuildings(this.ball.position, this.ball, this.walls);
    if (overlapsHole || overlapsBuildings) {
      this.ball.position = old;
      return;
    }
    this.ball.initialPosition = this.ball.position.clone();
    this.ball.endPosition = this.ball.position.clone();
  }

  private tryMoveHole(p: Vector2D): void {
    const nx = p.x - this.moveOffset.x;
    const ny = p.y - this.moveOffset.y;
    if (
      nx < this.hole.radius || nx > CANVAS_WIDTH - this.hole.radius ||
      ny < this.hole.radius || ny > CANVAS_HEIGHT - this.hole.radius
    ) return;
    const candidate = new Vector2D(nx, ny);
    if (holeOverlapsBall(candidate, this.ball, this.hole.radius)) return;
    if (holeOverlapsBuildings(candidate, this.hole.radius, this.walls)) return;
    this.hole.position = candidate;
  }

  private invalidPlacement(b: Building): boolean {
    // Check overlap with ball or hole
    const rect = { startX: b.x, startY: b.y, width: b.width, height: b.height };
    if (rectOverlapsBall(rect, this.ball)) return true;
    if (rectOverlapsHole(rect, this.hole)) return true;
    return false;
  }

  // ---------- Play pointer ----------
  private playDown(p: Vector2D): void {
    if (this.ball.isMoving || this.ball.isInHole) return;
    if (p.distance(this.ball.position) < this.ball.radius + 10) {
      this.isAiming = true;
      this.aimStart = this.ball.position.clone();
      this.aimEnd = p.clone();
    }
  }

  private playUp(_p: Vector2D): void {
    if (this.isAiming) this.shoot();
  }

  private shoot(): void {
    this.isAiming = false;
    const aim = computeAim(this.aimStart, this.aimEnd);
    const r = shootBall(this.ball, aim.velocity);
    if (r.shot) {
      this.audio.play('hit');
      this.turn.countShotByColor(this.ball.color, this.gameMode, this.playerMode);
      this.updateScoreUI();
    }
  }

  // ---------- Cursor ----------
  private updateCursor(p: Vector2D): void {
    if (this.state.state === GAME_STATES.DESIGN) {
      if (
        (this.design.ballMovable && p.distance(this.ball.position) < this.ball.radius + 5) ||
        (this.design.holeMovable && p.distance(this.hole.position) < this.hole.radius + 5) ||
        this.design.build.buildingAt(p.x, p.y)
      ) {
        setCursor(this.canvas, 'pointer');
      } else {
        setCursor(this.canvas, 'crosshair');
      }
    } else if (this.state.state === GAME_STATES.PLAY) {
      if (!this.ball.isMoving && !this.ball.isInHole && p.distance(this.ball.position) < this.ball.radius + 10) {
        setCursor(this.canvas, 'pointer');
      } else {
        setCursor(this.canvas, 'default');
      }
    } else {
      setCursor(this.canvas, 'default');
    }
  }

  // ---------- Physics: per-step collision resolution ----------
  private resolveCollisionsThisStep(): void {
    // Friction is determined by the single topmost terrain (highest zIndex)
    // the ball is currently on — matching the visible surface.
    const sortedTerrain = this.walls
      .filter((b) => b.type !== 'wall')
      .sort((a, b) => b.zIndex - a.zIndex);

    let topTerrainType: Building['type'] | null = null;
    for (const b of sortedTerrain) {
      if (b.intersects(this.ball)) {
        topTerrainType = b.type;
        break;
      }
    }

    // Wall collisions (placed walls + boundary) — independent of terrain
    for (const w of this.walls) {
      if (w.type !== 'wall') continue;
      if (w.intersects(this.ball)) this.resolveWallCollision(w);
    }
    for (const w of this.boundaryWalls) {
      if (w.intersects(this.ball)) this.resolveWallCollision(w);
    }

    switch (topTerrainType) {
      case 'water':     this.ball.currentFriction = WATER_FRICTION; break;
      case 'ice':       this.ball.currentFriction = ICE_FRICTION; break;
      case 'sand':      this.ball.currentFriction = SAND_FRICTION; break;
      case 'tallGrass': this.ball.currentFriction = TALL_GRASS_FRICTION; break;
      default:          this.ball.currentFriction = FRICTION;
    }
  }

  private resolveWallCollision(wall: Building): void {
    const closest = wall.getClosestPoint(this.ball);
    const dx = this.ball.position.x - closest.x;
    const dy = this.ball.position.y - closest.y;
    const distSq = dx * dx + dy * dy;
    if (distSq >= this.ball.radius * this.ball.radius) return;
    const dist = Math.sqrt(distSq);
    let nx: number, ny: number;
    if (dist === 0) {
      // Push out toward last position
      const ldx = this.ball.lastPosition.x - closest.x;
      const ldy = this.ball.lastPosition.y - closest.y;
      const lmag = Math.sqrt(ldx * ldx + ldy * ldy) || 1;
      nx = ldx / lmag; ny = ldy / lmag;
    } else {
      nx = dx / dist; ny = dy / dist;
    }
    // Reposition out
    const overlap = this.ball.radius - dist;
    this.ball.position.x += nx * overlap;
    this.ball.position.y += ny * overlap;
    // Reflect velocity
    const reflected = reflectVelocity(this.ball.velocity, new Vector2D(nx, ny), WALL_RESTITUTION);
    this.ball.velocity = reflected;
  }

  private checkHole(): void {
    if (this.ball.isInHole) return;
    if (this.hole.isBallHalfIn(this.ball)) {
      this.ball.isInHole = true;
      this.ball.isMoving = false;
      this.ball.velocity = new Vector2D(0, 0);
      this.audio.play('hole');
      this.confetti.spawn(this.hole.position.x, this.hole.position.y);
      this.holeAdvanceScheduled = true;
      setTimeout(() => {
        if (!this.holeAdvanceScheduled) return;
        this.holeAdvanceScheduled = false;
        this.afterHoleSuccess();
      }, 2000);
    }
  }

  private afterHoleSuccess(): void {
    // In multiplayer custom or premade-multi, switch to other player if not yet played
    if (this.progression.isPlayPhaseComplete(this.turn, this.gameMode, this.playerMode)) {
      this.nextPhase();
    } else {
      // Switch player
      this.turn.currentPlayer = this.turn.currentPlayer === 1 ? 2 : 1;
      this.updateBallColor();
      this.ball.respawn();
      this.message.show(`${TurnManager.playerName(this.turn.currentPlayer)}'s turn`);
      this.updateScoreUI();
    }
  }

  private checkWaterStop(): void {
    // If stopped on water with >50% overlap, splash and return to endPosition
    let onWaterMajor = false;
    let topZ = -Infinity;
    let chosen: Building | null = null;
    for (const b of this.walls) {
      if (b.type !== 'water') continue;
      if (!b.intersects(this.ball)) continue;
      // Approximate 50% overlap using closest point distance
      const closest = b.getClosestPoint(this.ball);
      const d = this.ball.position.distance(closest);
      // If distance from ball center to closest point on rect is < 0 (inside) OR ball mostly inside
      if (d < this.ball.radius * 0.5) {
        if (b.zIndex > topZ) { topZ = b.zIndex; chosen = b; onWaterMajor = true; }
      }
    }
    if (onWaterMajor && chosen) {
      this.audio.play('water');
      this.ball.position = this.ball.endPosition.clone();
      this.ball.velocity = new Vector2D(0, 0);
      this.ball.isMoving = false;
      this.ball.currentFriction = FRICTION;
    } else {
      // Save end position for next shot
      this.ball.endPosition = this.ball.position.clone();
      this.ball.lastStationaryPosition = this.ball.position.clone();
    }
  }

  // ---------- Main loop ----------
  private prevTime = performance.now();
  private accumulator = 0;
  private static readonly FIXED_DT = 1000 / 60;
  private static readonly MAX_FRAME_DT = 100;

  private loop(): void {
    const now = performance.now();
    const frameDt = Math.min(Game.MAX_FRAME_DT, now - this.prevTime);
    this.prevTime = now;

    this.accumulator += frameDt;
    while (this.accumulator >= Game.FIXED_DT) {
      this.fixedStep();
      this.accumulator -= Game.FIXED_DT;
    }

    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  private fixedStep(): void {
    if (this.state.state === GAME_STATES.PLAY && this.ball.isMoving) {
      const result = stepBall(this.ball, Game.FIXED_DT, () => {
        this.resolveCollisionsThisStep();
        this.checkHole();
      });
      if (result.stoppedThisFrame) {
        this.checkWaterStop();
      }
    }
    this.confetti.update();
  }

  private draw(): void {
    const preview: PreviewState = {
      active: this.design.build.isBuilding,
      start: this.design.build.buildStart,
      end: this.design.build.buildEnd,
      type: this.design.build.currentType,
    };
    const aim: AimState = {
      active: this.isAiming,
      start: this.aimStart,
      end: this.aimEnd,
      devMode: false,
    };
    // Validate min size; we still pass through, the renderer guards
    void MIN_BUILDING_SIZE;
    this.renderer.draw({
      ball: this.ball,
      hole: this.hole,
      walls: this.walls,
      boundaryWalls: this.boundaryWalls,
      selection: this.design.build.selection,
      confetti: this.confetti,
      preview,
      aim,
      showBuildingPreview: this.state.state === GAME_STATES.DESIGN,
    });
  }
}
