// Mini Militia 2D Doodle Arena - Vanilla HTML5 Canvas Engine
// Inspired by Doodle Army 2: Mini Militia

(function () {
  'use strict';

  // -------------------------------------------------------------
  // AUDIO SYNTHESIZER (Native Web Audio API - Zero External Assets)
  // -------------------------------------------------------------
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.initOnUserGesture();
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initOnUserGesture() {
      const unlock = () => {
        this.init();
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('click', unlock);
      window.addEventListener('keydown', unlock);
    }

    playShoot(type) {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (type === 'ASSAULT') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'SHOTGUN') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.16);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
          osc.start(now);
          osc.stop(now + 0.16);
        } else if (type === 'ROCKET') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(320, now + 0.12);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === 'SNIPER') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(850, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        }
      } catch (e) {}
    }

    playExplosion() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.45);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } catch (e) {}
    }

    playReload() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(900, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    playHit() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {}
    }

    playPickup() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.06);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    playJetpack() {
      if (!this.enabled || !this.ctx) return;
      if (Math.random() > 0.35) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(70 + Math.random() * 30, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {}
    }
  }

  const sound = new SoundManager();

  // -------------------------------------------------------------
  // WEAPONS DEFINITIONS
  // -------------------------------------------------------------
  const WEAPONS = {
    ASSAULT: {
      name: 'ASSAULT RIFLE',
      damage: 16,
      bulletSpeed: 21,
      fireRate: 110, // ms between shots
      magSize: 30,
      reloadTime: 1600,
      spread: 0.07,
      pellets: 1,
      barrelLength: 26,
      color: '#64748b',
      accent: '#facc15'
    },
    SHOTGUN: {
      name: 'PUMP SHOTGUN',
      damage: 13,
      bulletSpeed: 19,
      fireRate: 650,
      magSize: 8,
      reloadTime: 2000,
      spread: 0.22,
      pellets: 6,
      barrelLength: 24,
      color: '#475569',
      accent: '#ef4444'
    },
    ROCKET: {
      name: 'ROCKET LAUNCHER',
      damage: 95,
      bulletSpeed: 10,
      fireRate: 950,
      magSize: 4,
      reloadTime: 2400,
      spread: 0.02,
      pellets: 1,
      isRocket: true,
      barrelLength: 30,
      color: '#15803d',
      accent: '#f97316'
    },
    SNIPER: {
      name: 'SNIPER RIFLE',
      damage: 75,
      bulletSpeed: 34,
      fireRate: 850,
      magSize: 5,
      reloadTime: 2200,
      spread: 0.01,
      pellets: 1,
      barrelLength: 34,
      color: '#334155',
      accent: '#38bdf8'
    }
  };

  // -------------------------------------------------------------
  // MAP PLATFORMS & GEOMETRY (Classic Outpost / Rock Cavern)
  // -------------------------------------------------------------
  const WORLD_WIDTH = 2600;
  const WORLD_HEIGHT = 1500;

  const platforms = [
    // World boundary floors & walls
    { x: 0, y: WORLD_HEIGHT - 60, w: WORLD_WIDTH, h: 60, type: 'ground' },
    { x: 0, y: 0, w: WORLD_WIDTH, h: 40, type: 'ceiling' },
    { x: 0, y: 0, w: 40, h: WORLD_HEIGHT, type: 'wall' },
    { x: WORLD_WIDTH - 40, y: 0, w: 40, h: WORLD_HEIGHT, type: 'wall' },

    // Central Floating Island
    { x: 950, y: 880, w: 700, h: 50, type: 'rock' },
    { x: 1050, y: 640, w: 500, h: 40, type: 'rock' },
    { x: 1180, y: 400, w: 240, h: 35, type: 'rock' },

    // Left Complex (Tunnels and Bridges)
    { x: 180, y: 1150, w: 450, h: 40, type: 'rock' },
    { x: 300, y: 920, w: 380, h: 35, type: 'rock' },
    { x: 150, y: 680, w: 320, h: 35, type: 'rock' },
    { x: 420, y: 460, w: 280, h: 30, type: 'rock' },

    // Right Complex (Outpost Towers)
    { x: 1970, y: 1150, w: 450, h: 40, type: 'rock' },
    { x: 1920, y: 920, w: 380, h: 35, type: 'rock' },
    { x: 2130, y: 680, w: 320, h: 35, type: 'rock' },
    { x: 1900, y: 460, w: 280, h: 30, type: 'rock' },

    // Middle Lower Tunnels
    { x: 720, y: 1220, w: 220, h: 35, type: 'rock' },
    { x: 1660, y: 1220, w: 220, h: 35, type: 'rock' },

    // Cover Crates on platforms
    { x: 1120, y: 600, w: 40, h: 40, type: 'crate' },
    { x: 1440, y: 600, w: 40, h: 40, type: 'crate' },
    { x: 450, y: 880, w: 40, h: 40, type: 'crate' },
    { x: 2110, y: 880, w: 40, h: 40, type: 'crate' }
  ];

  // Spawn positions for players & bots
  const SPAWN_POINTS = [
    { x: 300, y: 600 },
    { x: 500, y: 400 },
    { x: 1300, y: 320 },
    { x: 2100, y: 400 },
    { x: 2200, y: 600 },
    { x: 1300, y: 800 },
    { x: 350, y: 1080 },
    { x: 2150, y: 1080 }
  ];

  // -------------------------------------------------------------
  // PARTICLE SYSTEM (Muzzle flashes, Blood, Smoke, Jet Exhaust, Shells)
  // -------------------------------------------------------------
  const particles = [];
  const bulletShells = [];
  const bloodDecals = [];

  class FloatingText {
    constructor(text, x, y, color = '#facc15') {
      this.text = text;
      this.x = x + (Math.random() - 0.5) * 10;
      this.y = y;
      this.vy = -1.5;
      this.color = color;
      this.life = 45;
      this.maxLife = 45;
    }

    update() {
      this.y += this.vy;
      this.vy *= 0.94;
      this.life--;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  const floatingTexts = [];

  class Particle {
    constructor(x, y, vx, vy, color, size, life, decay, type = 'generic') {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.size = size;
      this.maxLife = life;
      this.life = life;
      this.decay = decay;
      this.type = type;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.type === 'blood') {
        this.vy += 0.35; // Blood gravity
        this.vx *= 0.98;
      } else if (this.type === 'smoke') {
        this.vy -= 0.05; // Smoke drifts up
        this.vx *= 0.96;
        this.size += 0.3;
      } else if (this.type === 'jetpack') {
        this.size *= 0.94;
      }
      this.life -= this.decay;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class BulletShell {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.angle = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.4;
      this.life = 180;
    }

    update() {
      this.vy += 0.4;
      this.vx *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.vRot;

      // Platform bounce
      for (const p of platforms) {
        if (this.x >= p.x && this.x <= p.x + p.w && this.y >= p.y && this.y <= p.y + p.h) {
          this.y = p.y;
          this.vy = -this.vy * 0.4;
          this.vx *= 0.6;
          this.vRot *= 0.5;
          break;
        }
      }
      this.life--;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-3, -1.5, 6, 3);
      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // GRENADE CLASS
  // -------------------------------------------------------------
  class Grenade {
    constructor(x, y, vx, vy, owner) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.owner = owner;
      this.radius = 7;
      this.timer = 140; // ~2.3 seconds
      this.angle = 0;
      this.active = true;
    }

    update() {
      this.vy += 0.45; // gravity
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.vx * 0.08;

      // Platform collisions & bounce
      for (const p of platforms) {
        if (
          this.x + this.radius >= p.x &&
          this.x - this.radius <= p.x + p.w &&
          this.y + this.radius >= p.y &&
          this.y - this.radius <= p.y + p.h
        ) {
          // Determine collision face
          const overlapLeft = (this.x + this.radius) - p.x;
          const overlapRight = (p.x + p.w) - (this.x - this.radius);
          const overlapTop = (this.y + this.radius) - p.y;
          const overlapBottom = (p.y + p.h) - (this.y - this.radius);
          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

          if (minOverlap === overlapTop) {
            this.y = p.y - this.radius;
            this.vy = -this.vy * 0.55;
            this.vx *= 0.85;
          } else if (minOverlap === overlapBottom) {
            this.y = p.y + p.h + this.radius;
            this.vy = -this.vy * 0.55;
          } else {
            this.vx = -this.vx * 0.65;
          }
          break;
        }
      }

      // Smoke trail
      if (Math.random() < 0.3) {
        particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 0.8, -0.4, '#94a3b8', 3, 25, 1, 'smoke'));
      }

      this.timer--;
      if (this.timer <= 0) {
        this.explode();
      }
    }

    explode() {
      this.active = false;
      sound.playExplosion();
      game.triggerScreenShake(18);

      // Huge explosion visual burst
      for (let i = 0; i < 40; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 9;
        const color = Math.random() > 0.4 ? '#f97316' : (Math.random() > 0.5 ? '#facc15' : '#ef4444');
        particles.push(new Particle(this.x, this.y, Math.cos(ang) * spd, Math.sin(ang) * spd, color, 4 + Math.random() * 5, 45, 1, 'smoke'));
      }
      for (let i = 0; i < 20; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 7;
        particles.push(new Particle(this.x, this.y, Math.cos(ang) * spd, Math.sin(ang) * spd, '#334155', 3, 35, 1, 'smoke'));
      }

      // AoE Damage
      const blastRadius = 150;
      const blastDamage = 110;
      const soldiers = [game.player, ...game.bots];

      soldiers.forEach(soldier => {
        if (!soldier.alive) return;
        const dx = soldier.x - this.x;
        const dy = soldier.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < blastRadius) {
          const falloff = 1 - (dist / blastRadius);
          const dmg = Math.round(blastDamage * falloff);
          // Knockback force
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);
          soldier.vx += nx * 14 * falloff;
          soldier.vy += (ny * 14 * falloff) - 5;
          soldier.takeDamage(dmg, this.owner, 'GRENADE');
        }
      });
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Grenade body (military olive)
      ctx.fillStyle = '#3f6212';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Pin / Fuse top
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(-2, -this.radius - 3, 4, 3);

      // Blinking red indicator
      if (Math.floor(this.timer / 10) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, -1, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // BULLET & ROCKET CLASS
  // -------------------------------------------------------------
  class Bullet {
    constructor(x, y, vx, vy, damage, owner, isRocket = false, weaponName = 'RIFLE') {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.damage = damage;
      this.owner = owner;
      this.isRocket = isRocket;
      this.weaponName = weaponName;
      this.prevX = x;
      this.prevY = y;
      this.life = 120;
      this.active = true;
    }

    update() {
      this.prevX = this.x;
      this.prevY = this.y;
      this.x += this.vx;
      this.y += this.vy;

      if (this.isRocket) {
        // Rocket trail smoke & fire
        if (Math.random() < 0.6) {
          particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 1.5 - this.vx * 0.15, (Math.random() - 0.5) * 1.5 - this.vy * 0.15, '#f97316', 3.5, 20, 1, 'smoke'));
          particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, '#94a3b8', 4, 30, 1, 'smoke'));
        }
      }

      // Check collision with platforms
      for (const p of platforms) {
        if (this.x >= p.x && this.x <= p.x + p.w && this.y >= p.y && this.y <= p.y + p.h) {
          this.active = false;
          if (this.isRocket) {
            this.explode();
          } else {
            // Bullet spark
            for (let i = 0; i < 4; i++) {
              particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, '#facc15', 1.5, 12, 1));
            }
          }
          return;
        }
      }

      // Check collision with soldiers
      const allSoldiers = [game.player, ...game.bots];
      for (const soldier of allSoldiers) {
        if (!soldier.alive || soldier === this.owner) continue;

        // Soldier bounding box check
        const halfW = 16;
        const halfH = soldier.isCrouching ? 16 : 24;
        const boxX = soldier.x - halfW;
        const boxY = soldier.y - halfH;

        if (this.x >= boxX && this.x <= boxX + halfW * 2 && this.y >= boxY && this.y <= boxY + halfH * 2) {
          this.active = false;
          if (this.isRocket) {
            this.explode();
          } else {
            // Blood splash
            sound.playHit();
            for (let i = 0; i < 7; i++) {
              particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 4 + this.vx * 0.1, (Math.random() - 0.5) * 4 + this.vy * 0.1, '#dc2626', 2.5, 30, 1, 'blood'));
            }
            soldier.takeDamage(this.damage, this.owner, this.weaponName);
          }
          return;
        }
      }

      this.life--;
      if (this.life <= 0) {
        this.active = false;
        if (this.isRocket) this.explode();
      }
    }

    explode() {
      sound.playExplosion();
      game.triggerScreenShake(14);
      for (let i = 0; i < 30; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 8;
        const color = Math.random() > 0.5 ? '#f97316' : '#facc15';
        particles.push(new Particle(this.x, this.y, Math.cos(ang) * spd, Math.sin(ang) * spd, color, 4 + Math.random() * 4, 35, 1, 'smoke'));
      }

      const blastRadius = 120;
      const blastDmg = this.damage;
      const soldiers = [game.player, ...game.bots];
      soldiers.forEach(soldier => {
        if (!soldier.alive) return;
        const dist = Math.hypot(soldier.x - this.x, soldier.y - this.y);
        if (dist < blastRadius) {
          const falloff = 1 - (dist / blastRadius);
          soldier.vx += (soldier.x - this.x) / (dist || 1) * 12 * falloff;
          soldier.vy += (soldier.y - this.y) / (dist || 1) * 12 * falloff - 4;
          soldier.takeDamage(Math.round(blastDmg * falloff), this.owner, 'ROCKET LAUNCHER');
        }
      });
    }

    draw(ctx) {
      ctx.save();
      if (this.isRocket) {
        const angle = Math.atan2(this.vy, this.vx);
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        // Rocket warhead & body
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-10, -3.5, 20, 7);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(10, -3.5);
        ctx.lineTo(15, 0);
        ctx.lineTo(10, 3.5);
        ctx.fill();
        // Rocket fins
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-10, -5.5, 4, 11);
      } else {
        // High-velocity bullet tracer
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // PICKUP ITEM CLASS (Medkit, Nitro Tank, Heavy Weapons)
  // -------------------------------------------------------------
  class Pickup {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.baseY = y;
      this.type = type; // 'MEDKIT' | 'NITRO' | 'SHOTGUN' | 'ROCKET' | 'SNIPER' | 'GRENADES'
      this.active = true;
      this.respawnTimer = 0;
      this.hoverTime = Math.random() * 10;
    }

    update() {
      if (!this.active) {
        this.respawnTimer--;
        if (this.respawnTimer <= 0) {
          this.active = true;
        }
        return;
      }
      this.hoverTime += 0.05;
      this.y = this.baseY + Math.sin(this.hoverTime) * 5;

      // Check collision with player & bots
      const soldiers = [game.player, ...game.bots];
      for (const soldier of soldiers) {
        if (!soldier.alive) continue;
        const dist = Math.hypot(soldier.x - this.x, soldier.y - this.y);
        if (dist < 26) {
          this.applyTo(soldier);
          break;
        }
      }
    }

    applyTo(soldier) {
      let taken = false;
      if (this.type === 'MEDKIT' && soldier.hp < 100) {
        soldier.hp = Math.min(100, soldier.hp + 50);
        taken = true;
      } else if (this.type === 'NITRO' && soldier.nitro < 100) {
        soldier.nitro = 100;
        taken = true;
      } else if (this.type === 'GRENADES' && soldier.grenades < 5) {
        soldier.grenades = Math.min(5, soldier.grenades + 2);
        taken = true;
      } else if (this.type === 'SHOTGUN' || this.type === 'ROCKET' || this.type === 'SNIPER') {
        soldier.equipWeapon(this.type);
        taken = true;
      }

      if (taken) {
        sound.playPickup();
        this.active = false;
        this.respawnTimer = 650; // ~11s respawn
        // Sparkle ring
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2;
          particles.push(new Particle(this.x, this.y, Math.cos(ang) * 3, Math.sin(ang) * 3, '#38bdf8', 2, 20, 1));
        }
      }
    }

    draw(ctx) {
      if (!this.active) return;
      ctx.save();
      ctx.translate(this.x, this.y);

      // Glow halo
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Crate box
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-12, -12, 24, 24);
      ctx.strokeRect(-12, -12, 24, 24);

      if (this.type === 'MEDKIT') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-8, -8, 16, 16);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-2, -6, 4, 12);
        ctx.fillRect(-6, -2, 12, 4);
      } else if (this.type === 'NITRO') {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-7, -8, 14, 16);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(4, 2);
        ctx.lineTo(-4, 2);
        ctx.fill();
      } else if (this.type === 'GRENADES') {
        ctx.fillStyle = '#4d7c0f';
        ctx.beginPath();
        ctx.arc(0, 1, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-1, -7, 2, 3);
      } else if (this.type === 'SHOTGUN') {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-9, -2, 18, 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, -4, 9, 2);
      } else if (this.type === 'ROCKET') {
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(-10, -3, 20, 6);
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(10, -3);
        ctx.lineTo(13, 0);
        ctx.lineTo(10, 3);
        ctx.fill();
      } else if (this.type === 'SNIPER') {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-11, -1.5, 22, 3);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, -4, 8, 2);
      }

      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // SOLDIER CLASS (Player & AI Bot Doodle Soldiers)
  // -------------------------------------------------------------
  class Soldier {
    constructor(name, x, y, isBot = false, color = '#22c55e') {
      this.name = name;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.isBot = isBot;
      this.color = color; // Helmet / uniform primary color

      this.hp = 100;
      this.maxHp = 100;
      this.nitro = 100;
      this.maxNitro = 100;
      this.alive = true;
      this.kills = 0;
      this.deaths = 0;
      this.score = 0;

      this.grenades = 3;
      this.currentWeaponKey = 'ASSAULT';
      this.weapon = WEAPONS.ASSAULT;
      this.ammo = this.weapon.magSize;
      this.isReloading = false;
      this.reloadProgress = 0;
      this.lastShotTime = 0;

      this.aimAngle = 0;
      this.facing = 1; // 1 = right, -1 = left
      this.onGround = false;
      this.isCrouching = false;
      this.isBoosting = false;

      // Animation variables
      this.walkCycle = 0;
      this.recoilKick = 0;
      this.respawnTimer = 0;

      // Bot AI state variables
      this.botState = 'PATROL';
      this.botTarget = null;
      this.botReactionTimer = 0;
      this.botPatrolDir = Math.random() > 0.5 ? 1 : -1;
      this.botPatrolTimer = 60;
    }

    equipWeapon(weaponKey) {
      if (WEAPONS[weaponKey]) {
        this.currentWeaponKey = weaponKey;
        this.weapon = WEAPONS[weaponKey];
        this.ammo = this.weapon.magSize;
        this.isReloading = false;
      }
    }

    startReload() {
      if (this.isReloading || this.ammo === this.weapon.magSize) return;
      this.isReloading = true;
      this.reloadProgress = 0;
      sound.playReload();
    }

    throwGrenade() {
      if (this.grenades <= 0 || !this.alive) return;
      this.grenades--;
      const speed = 15;
      const vx = Math.cos(this.aimAngle) * speed + this.vx * 0.4;
      const vy = Math.sin(this.aimAngle) * speed + this.vy * 0.4 - 2;
      game.grenades.push(new Grenade(this.x, this.y - 10, vx, vy, this));
    }

    shoot() {
      if (!this.alive || this.isReloading) return;
      const now = Date.now();
      if (now - this.lastShotTime < this.weapon.fireRate) return;

      if (this.ammo <= 0) {
        this.startReload();
        return;
      }

      this.ammo--;
      this.lastShotTime = now;
      this.recoilKick = 6;
      sound.playShoot(this.weapon.isRocket ? 'ROCKET' : this.currentWeaponKey);

      if (!this.isBot && this.currentWeaponKey === 'ROCKET') {
        game.triggerScreenShake(7);
      }

      // Eject bullet casing
      const shellVx = -Math.cos(this.aimAngle) * 3 + (Math.random() - 0.5) * 2;
      const shellVy = -2 - Math.random() * 2;
      bulletShells.push(new BulletShell(this.x + Math.cos(this.aimAngle) * 10, this.y - 10, shellVx, shellVy));

      // Muzzle flash particle
      const muzzleX = this.x + Math.cos(this.aimAngle) * this.weapon.barrelLength;
      const muzzleY = this.y - 8 + Math.sin(this.aimAngle) * this.weapon.barrelLength;
      particles.push(new Particle(muzzleX, muzzleY, Math.cos(this.aimAngle) * 2, Math.sin(this.aimAngle) * 2, '#fef08a', 5, 8, 1));

      // Fire pellets / projectiles
      for (let p = 0; p < this.weapon.pellets; p++) {
        const spreadOffset = (Math.random() - 0.5) * this.weapon.spread;
        const shotAngle = this.aimAngle + spreadOffset;
        const bvx = Math.cos(shotAngle) * this.weapon.bulletSpeed;
        const bvy = Math.sin(shotAngle) * this.weapon.bulletSpeed;

        game.bullets.push(
          new Bullet(
            muzzleX,
            muzzleY,
            bvx,
            bvy,
            this.weapon.damage,
            this,
            !!this.weapon.isRocket,
            this.weapon.name
          )
        );
      }

      if (this.ammo <= 0) {
        this.startReload();
      }
    }

    takeDamage(amount, attacker, weaponName = 'WEAPON') {
      if (!this.alive) return;
      this.hp -= amount;

      // Spawn floating damage indicator
      floatingTexts.push(new FloatingText(`-${amount}`, this.x, this.y - 20, amount >= 40 ? '#ef4444' : '#facc15'));

      if (this.hp <= 0) {
        this.hp = 0;
        this.die(attacker, weaponName);
      }
    }

    die(killer, weaponName) {
      this.alive = false;
      this.deaths++;
      this.respawnTimer = 180; // 3 seconds

      if (killer && killer !== this) {
        killer.kills++;
        killer.score += 100;
        game.addKillfeed(killer.name, this.name, weaponName);
      } else {
        game.addKillfeed(this.name, this.name, 'MISTAKE');
      }

      // Massive death blood & ragdoll effect
      for (let i = 0; i < 25; i++) {
        particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 6, -Math.random() * 6, '#dc2626', 3 + Math.random() * 2, 45, 1, 'blood'));
      }

      if (this === game.player) {
        game.showRespawnOverlay(killer ? killer.name : 'an explosion');
      }
    }

    respawn() {
      const pt = SPAWN_POINTS[Math.floor(Math.random() * SPAWN_POINTS.length)];
      this.x = pt.x;
      this.y = pt.y;
      this.vx = 0;
      this.vy = 0;
      this.hp = 100;
      this.nitro = 100;
      this.ammo = this.weapon.magSize;
      this.grenades = 3;
      this.isReloading = false;
      this.alive = true;

      if (this === game.player) {
        game.hideRespawnOverlay();
      }
    }

    updatePhysics() {
      if (!this.alive) {
        this.respawnTimer--;
        if (this.respawnTimer <= 0) {
          this.respawn();
        }
        return;
      }

      // Reload timer
      if (this.isReloading) {
        this.reloadProgress += 16.6;
        if (this.reloadProgress >= this.weapon.reloadTime) {
          this.isReloading = false;
          this.ammo = this.weapon.magSize;
        }
      }

      // Recoil kick decay
      this.recoilKick *= 0.85;

      // Apply Gravity
      this.vy += 0.38;

      // Horizontal friction
      if (this.onGround) {
        this.vx *= 0.82;
      } else {
        this.vx *= 0.94;
      }

      // Air vertical drag
      this.vy *= 0.985;

      // Nitro Regeneration
      if (this.onGround) {
        this.nitro = Math.min(100, this.nitro + 0.55);
      } else if (!this.isBoosting) {
        this.nitro = Math.min(100, this.nitro + 0.18);
      }

      // Proposed movement
      const nextX = this.x + this.vx;
      const nextY = this.y + this.vy;

      // Platform Collisions (AABB against soldier bounding box)
      const halfW = 14;
      const halfH = this.isCrouching ? 16 : 24;
      this.onGround = false;

      for (const p of platforms) {
        // Broad phase
        if (
          nextX + halfW > p.x &&
          nextX - halfW < p.x + p.w &&
          nextY + halfH > p.y &&
          nextY - halfH < p.y + p.h
        ) {
          // Calculate overlaps
          const prevBottom = this.y + halfH;
          const prevTop = this.y - halfH;

          // Landing on top
          if (prevBottom <= p.y + 10 && this.vy >= 0) {
            this.y = p.y - halfH;
            this.vy = 0;
            this.onGround = true;
          }
          // Hitting ceiling
          else if (prevTop >= p.y + p.h - 10 && this.vy < 0) {
            this.y = p.y + p.h + halfH;
            this.vy = 0;
          }
          // Lateral walls
          else {
            if (this.vx > 0) {
              this.x = p.x - halfW;
              this.vx = 0;
            } else if (this.vx < 0) {
              this.x = p.x + p.w + halfW;
              this.vx = 0;
            }
          }
        }
      }

      if (!this.onGround) {
        this.y += this.vy;
      }
      this.x += this.vx;

      // World bounds clamp
      this.x = Math.max(50, Math.min(WORLD_WIDTH - 50, this.x));
      this.y = Math.max(50, Math.min(WORLD_HEIGHT - 70, this.y));

      // Walking animation
      if (this.onGround && Math.abs(this.vx) > 0.3) {
        this.walkCycle += Math.abs(this.vx) * 0.18;
      } else {
        this.walkCycle = 0;
      }
    }

    applyJetpack(dirX, dirY) {
      if (this.nitro <= 0 || !this.alive) return;
      this.isBoosting = true;
      this.nitro = Math.max(0, this.nitro - 0.7);

      const thrust = 0.95;
      this.vx += dirX * thrust;
      this.vy += dirY * thrust;
      sound.playJetpack();

      // Emit boots jetpack exhaust flame and smoke
      const bootOffset = this.isCrouching ? 14 : 24;
      const bootX = this.x - this.facing * 4;
      const bootY = this.y + bootOffset;

      for (let i = 0; i < 2; i++) {
        const pVx = -dirX * 3 + (Math.random() - 0.5) * 2;
        const pVy = -dirY * 3 + (Math.random() - 0.5) * 2;
        particles.push(new Particle(bootX, bootY, pVx, pVy, '#f97316', 3.5, 14, 1, 'jetpack'));
        particles.push(new Particle(bootX, bootY, pVx * 0.7, pVy * 0.7, '#38bdf8', 2.5, 10, 1, 'jetpack'));
      }
    }

    // AI Bot State Machine & Decision Logic
    updateAI() {
      if (!this.alive) return;
      const player = game.player;

      // Line of sight check to player
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distToPlayer = Math.hypot(dx, dy);

      this.aimAngle = Math.atan2(dy, dx);
      this.facing = dx >= 0 ? 1 : -1;

      // Reload if low on ammo and safe
      if (this.ammo <= 5 && !this.isReloading && distToPlayer > 300) {
        this.startReload();
      }

      // Low health behavior: seek medkit or flee
      if (this.hp < 35) {
        this.botState = 'RETREAT';
      } else if (distToPlayer < 650 && player.alive) {
        this.botState = 'COMBAT';
      } else {
        this.botState = 'PATROL';
      }

      if (this.botState === 'COMBAT') {
        // Fly if player is significantly higher
        if (dy < -60 && this.nitro > 20) {
          this.applyJetpack(dx > 0 ? 0.4 : -0.4, -0.9);
        } else if (distToPlayer > 350) {
          // Advance towards player
          this.vx += (dx > 0 ? 0.35 : -0.35);
        } else if (distToPlayer < 140) {
          // Back up slightly
          this.vx -= (dx > 0 ? 0.3 : -0.3);
        }

        // Fire weapon when in range
        if (distToPlayer < 600) {
          this.shoot();
        }

        // Lob grenade if player is hiding behind cover
        if (distToPlayer > 200 && distToPlayer < 450 && Math.random() < 0.008 && this.grenades > 0) {
          this.throwGrenade();
        }
      } else if (this.botState === 'RETREAT') {
        // Move away from player
        this.vx += (dx > 0 ? -0.4 : 0.4);
        if (this.nitro > 30 && Math.random() < 0.25) {
          this.applyJetpack(dx > 0 ? -0.5 : 0.5, -0.6);
        }
      } else {
        // Patrol
        this.botPatrolTimer--;
        if (this.botPatrolTimer <= 0) {
          this.botPatrolDir = Math.random() > 0.5 ? 1 : -1;
          this.botPatrolTimer = 90 + Math.random() * 120;
        }
        this.vx += this.botPatrolDir * 0.3;
        // Fly over gaps occasionally
        if (Math.random() < 0.015 && this.nitro > 40) {
          this.applyJetpack(this.botPatrolDir * 0.5, -0.8);
        }
      }

      this.isBoosting = false;
    }

    // Procedural Vector Doodle Army Soldier Drawing
    draw(ctx) {
      if (!this.alive) return;
      ctx.save();
      ctx.translate(this.x, this.y);

      // Facing orientation
      const flip = this.facing === -1;
      const crouchDrop = this.isCrouching ? 8 : 0;

      // 1. BOOTS (Animated floating combat boots)
      const bootWalk = Math.sin(this.walkCycle) * 6;
      ctx.fillStyle = '#1e293b';
      // Left boot
      ctx.fillRect(-10 - (flip ? -bootWalk : bootWalk), 18 - crouchDrop, 8, 7);
      // Right boot
      ctx.fillRect(2 + (flip ? -bootWalk : bootWalk), 18 - crouchDrop, 8, 7);

      // 2. TORSO / BODY (Military tactical vest)
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 4 - crouchDrop, 11, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tactical harness straps & ammo belt
      ctx.fillStyle = '#334155';
      ctx.fillRect(-6, 2 - crouchDrop, 12, 3);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4, 3 - crouchDrop, 3, 2);
      ctx.fillRect(1, 3 - crouchDrop, 3, 2);

      // 3. HEAD (Classic Mini Militia round doodle head)
      ctx.fillStyle = '#fde047'; // Doodle flesh tone
      ctx.beginPath();
      ctx.arc(0, -12 - crouchDrop, 13, 0, Math.PI * 2);
      ctx.fill();

      // Military Helmet / Headband
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, -15 - crouchDrop, 14, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-14, -16 - crouchDrop, 28, 4);

      // Star / Rank on helmet
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -18 - crouchDrop, 2, 0, Math.PI * 2);
      ctx.fill();

      // Big expressive eyes
      const eyeAimX = Math.cos(this.aimAngle) * 3;
      const eyeAimY = Math.sin(this.aimAngle) * 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-4 + eyeAimX, -12 - crouchDrop + eyeAimY, 3.5, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(4 + eyeAimX, -12 - crouchDrop + eyeAimY, 3.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Black pupils looking towards gun aim
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-4 + eyeAimX * 1.3, -12 - crouchDrop + eyeAimY * 1.3, 1.8, 0, Math.PI * 2);
      ctx.arc(4 + eyeAimX * 1.3, -12 - crouchDrop + eyeAimY * 1.3, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 4. WEAPON & HANDS (Rotates 360 degrees around soldier center)
      ctx.save();
      ctx.translate(0, -2 - crouchDrop);
      ctx.rotate(this.aimAngle);
      ctx.translate(-this.recoilKick, 0);

      // Weapon body
      ctx.fillStyle = this.weapon.color;
      ctx.fillRect(0, -3.5, this.weapon.barrelLength, 7);

      // Accent trim & magazine
      ctx.fillStyle = this.weapon.accent;
      ctx.fillRect(6, -1.5, 8, 3);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, 3, 5, 8); // Magazine box

      // Hands gripping the weapon (Mini Militia floating circular hands)
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(6, 2, 3.5, 0, Math.PI * 2);
      ctx.arc(18, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Name & Mini Health Bar above head
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, 0, -32 - crouchDrop);

      // Health bar overhead
      const barW = 32;
      const barH = 4;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-barW / 2, -28 - crouchDrop, barW, barH);
      ctx.fillStyle = this.hp > 35 ? '#22c55e' : '#ef4444';
      ctx.fillRect(-barW / 2, -28 - crouchDrop, (this.hp / this.maxHp) * barW, barH);

      // Reloading circular timer overhead
      if (this.isReloading) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const reloadRatio = Math.min(1, this.reloadProgress / this.weapon.reloadTime);
        ctx.arc(0, -42 - crouchDrop, 7, -Math.PI / 2, -Math.PI / 2 + reloadRatio * Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 9px Segoe UI, sans-serif';
        ctx.fillText('RELOAD', 0, -52 - crouchDrop);
      }

      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // GAME ENGINE ORCHESTRATOR
  // -------------------------------------------------------------
  class GameEngine {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');

      this.camera = { x: 0, y: 0, targetX: 0, targetY: 0, shake: 0 };
      this.keys = {};
      this.mouse = { x: 0, y: 0, worldX: 0, worldY: 0, leftDown: false, rightDown: false };

      this.player = null;
      this.bots = [];
      this.bullets = [];
      this.grenades = [];
      this.pickups = [];

      this.paused = false;
      this.inMenu = true;
      this.killfeedItems = [];

      this.setupCanvas();
      this.bindEvents();
      this.initWorld();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    setupCanvas() {
      const resize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();
    }

    initWorld() {
      // Create Player
      this.player = new Soldier('YOU (SOLDIER)', 400, 500, false, '#22c55e');

      // Create 4 Bot Opponents with iconic Doodle names and uniforms
      this.bots = [
        new Soldier('Sarge', 1200, 300, true, '#15803d'),
        new Soldier('Cataclysmo', 2000, 500, true, '#dc2626'),
        new Soldier('NoobSlayer', 1800, 800, true, '#0284c7'),
        new Soldier('Roxx', 600, 800, true, '#ea580c')
      ];

      // Spawn pickups around arena
      this.pickups = [
        new Pickup(1140, 370, 'MEDKIT'),
        new Pickup(1300, 610, 'ROCKET'),
        new Pickup(460, 430, 'SHOTGUN'),
        new Pickup(2040, 430, 'SNIPER'),
        new Pickup(2060, 890, 'MEDKIT'),
        new Pickup(1300, 850, 'NITRO'),
        new Pickup(490, 890, 'GRENADES'),
        new Pickup(830, 1190, 'SHOTGUN'),
        new Pickup(1770, 1190, 'ROCKET')
      ];
    }

    bindEvents() {
      window.addEventListener('keydown', (e) => {
        this.keys[e.code] = true;

        if (e.code === 'KeyR' && this.player) {
          this.player.startReload();
        }
        if (e.code === 'KeyG' && this.player) {
          this.player.throwGrenade();
        }
        if (e.code === 'Tab') {
          e.preventDefault();
          this.toggleLeaderboard(true);
        }
        if (e.code === 'Escape') {
          this.togglePause();
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
        if (e.code === 'Tab') {
          this.toggleLeaderboard(false);
        }
      });

      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      window.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          this.mouse.leftDown = true;
          if (this.player && this.player.alive && !this.paused && !this.inMenu) {
            this.player.shoot();
          }
        } else if (e.button === 2) {
          this.mouse.rightDown = true;
        }
      });

      window.addEventListener('mouseup', (e) => {
        if (e.button === 0) this.mouse.leftDown = false;
        if (e.button === 2) this.mouse.rightDown = false;
      });

      window.addEventListener('contextmenu', (e) => e.preventDefault());

      // UI Button hooks
      document.getElementById('startBtn').addEventListener('click', () => {
        sound.init();
        document.getElementById('menuOverlay').style.display = 'none';
        this.inMenu = false;
        this.paused = false;
      });

      document.getElementById('resumeBtn').addEventListener('click', () => {
        this.togglePause();
      });

      const menuBtn = document.getElementById('menuBtn');
      if (menuBtn) {
        menuBtn.addEventListener('click', () => {
          this.togglePause();
        });
      }

      const audioBtn = document.getElementById('audioToggleBtn');
      audioBtn.addEventListener('click', () => {
        sound.init();
        sound.enabled = !sound.enabled;
        audioBtn.textContent = sound.enabled ? '🔊 SOUND ON' : '🔇 SOUND OFF';
      });

      // Mobile Touch Controls initialization
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        const touchDiv = document.getElementById('touchControls');
        if (touchDiv) touchDiv.style.display = 'flex';

        const boostBtn = document.getElementById('btnTouchBoost');
        if (boostBtn) {
          boostBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys['Space'] = true; });
          boostBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.keys['Space'] = false; });
        }

        const shootBtn = document.getElementById('btnTouchShoot');
        if (shootBtn) {
          shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.mouse.leftDown = true;
            if (this.player && this.player.alive && !this.paused && !this.inMenu) {
              this.player.shoot();
            }
          });
          shootBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.mouse.leftDown = false; });
        }

        const grenadeBtn = document.getElementById('btnTouchGrenade');
        if (grenadeBtn) {
          grenadeBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.player) this.player.throwGrenade();
          });
        }

        const reloadBtn = document.getElementById('btnTouchReload');
        if (reloadBtn) {
          reloadBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.player) this.player.startReload();
          });
        }
      }
    }

    togglePause() {
      if (this.inMenu) return;
      this.paused = !this.paused;
      const menu = document.getElementById('menuOverlay');
      const resume = document.getElementById('resumeBtn');
      const start = document.getElementById('startBtn');
      if (this.paused) {
        menu.style.display = 'flex';
        resume.style.display = 'inline-block';
        start.style.display = 'none';
      } else {
        menu.style.display = 'none';
      }
    }

    toggleLeaderboard(show) {
      const modal = document.getElementById('leaderboardModal');
      modal.style.display = show ? 'block' : 'none';
      if (show) {
        const rows = document.getElementById('lbRows');
        const soldiers = [this.player, ...this.bots].sort((a, b) => b.score - a.score);
        rows.innerHTML = soldiers.map(s => `
          <tr style="${s === this.player ? 'color:#4ade80; font-weight:bold;' : ''}">
            <td>${s.name}</td>
            <td>${s.kills}</td>
            <td>${s.deaths}</td>
            <td>${s.score}</td>
          </tr>
        `).join('');
      }
    }

    triggerScreenShake(magnitude) {
      this.camera.shake = Math.min(25, this.camera.shake + magnitude);
    }

    addKillfeed(killer, victim, weapon) {
      const feed = document.getElementById('killfeed');
      const item = document.createElement('div');
      item.className = 'kill-item';
      item.innerHTML = `<span style="color:#facc15;">${killer}</span> 💥 [<span style="color:#38bdf8;">${weapon}</span>] ➜ ${victim}`;
      feed.appendChild(item);
      setTimeout(() => {
        if (item.parentNode) item.parentNode.removeChild(item);
      }, 4500);
    }

    showRespawnOverlay(killerName) {
      const overlay = document.getElementById('respawnOverlay');
      const killerText = document.getElementById('deathKillerText');
      const counter = document.getElementById('respawnCountdown');
      killerText.textContent = `Eliminated by ${killerName}`;
      overlay.style.display = 'flex';

      let count = 3;
      counter.textContent = count;
      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          counter.textContent = count;
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }

    hideRespawnOverlay() {
      document.getElementById('respawnOverlay').style.display = 'none';
    }

    updatePlayerInput() {
      if (!this.player || !this.player.alive || this.paused || this.inMenu) return;

      // Mouse Aim angle in world coordinates
      this.mouse.worldX = this.mouse.x + this.camera.x;
      this.mouse.worldY = this.mouse.y + this.camera.y;

      const dx = this.mouse.worldX - this.player.x;
      const dy = this.mouse.worldY - (this.player.y - 8);
      this.player.aimAngle = Math.atan2(dy, dx);
      this.player.facing = dx >= 0 ? 1 : -1;

      // Horizontal movement: A and D keys
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
        this.player.vx -= 0.55;
      }
      if (this.keys['KeyD'] || this.keys['ArrowRight']) {
        this.player.vx += 0.55;
      }

      // Crouch / Prone: S key
      this.player.isCrouching = !!(this.keys['KeyS'] || this.keys['ArrowDown']);

      // Jetpack Flight Mechanic: Spacebar, W, or Right-Click initiates thrust
      this.player.isBoosting = false;
      if (this.keys['Space'] || this.keys['KeyW'] || this.keys['ArrowUp'] || this.mouse.rightDown) {
        if (this.mouse.rightDown) {
          // Right-click thrusts directly towards mouse cursor
          const aimLen = Math.hypot(dx, dy) || 1;
          this.player.applyJetpack(dx / aimLen, dy / aimLen);
        } else {
          // Space / W applies strong upward thrust with horizontal steering
          const steerX = (this.keys['KeyD'] ? 0.4 : 0) - (this.keys['KeyA'] ? 0.4 : 0);
          this.player.applyJetpack(steerX, -1.0);
        }
      }

      // Automatic fire while holding Left Mouse
      if (this.mouse.leftDown && this.player.weapon.fireRate < 250) {
        this.player.shoot();
      }
    }

    updateHUD() {
      if (!this.player) return;
      document.getElementById('hpText').textContent = `${Math.round(this.player.hp)} / 100`;
      document.getElementById('hpFill').style.width = `${Math.max(0, this.player.hp)}%`;

      document.getElementById('nitroText').textContent = `${Math.round(this.player.nitro)}%`;
      document.getElementById('nitroFill').style.width = `${Math.max(0, this.player.nitro)}%`;

      document.getElementById('weaponName').textContent = this.player.isReloading ? 'RELOADING...' : this.player.weapon.name;
      document.getElementById('ammoCount').textContent = `${this.player.ammo} / ∞`;
      document.getElementById('grenadeNum').textContent = this.player.grenades;

      document.getElementById('playerKills').textContent = this.player.kills;
      document.getElementById('playerDeaths').textContent = this.player.deaths;
      document.getElementById('playerScore').textContent = this.player.score;
    }

    update() {
      if (this.paused) return;

      this.updatePlayerInput();

      // Update Player & Bots
      this.player.updatePhysics();
      this.bots.forEach(bot => {
        bot.updateAI();
        bot.updatePhysics();
      });

      // Update Bullets
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        const b = this.bullets[i];
        b.update();
        if (!b.active) this.bullets.splice(i, 1);
      }

      // Update Grenades
      for (let i = this.grenades.length - 1; i >= 0; i--) {
        const g = this.grenades[i];
        g.update();
        if (!g.active) this.grenades.splice(i, 1);
      }

      // Update Pickups
      this.pickups.forEach(p => p.update());

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.update();
        if (pt.life <= 0) particles.splice(i, 1);
      }

      // Update Shells
      for (let i = bulletShells.length - 1; i >= 0; i--) {
        const sh = bulletShells[i];
        sh.update();
        if (sh.life <= 0) bulletShells.splice(i, 1);
      }

      // Update Floating Damage Texts
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.update();
        if (ft.life <= 0) floatingTexts.splice(i, 1);
      }

      // Camera lerping to track player
      if (this.player) {
        const targetCamX = this.player.x - this.canvas.width / 2;
        const targetCamY = this.player.y - this.canvas.height / 2;
        this.camera.x += (targetCamX - this.camera.x) * 0.1;
        this.camera.y += (targetCamY - this.camera.y) * 0.1;

        // Clamp camera to world bounds
        this.camera.x = Math.max(0, Math.min(WORLD_WIDTH - this.canvas.width, this.camera.x));
        this.camera.y = Math.max(0, Math.min(WORLD_HEIGHT - this.canvas.height, this.camera.y));
      }

      // Screen shake decay
      if (this.camera.shake > 0) {
        this.camera.shake *= 0.9;
        if (this.camera.shake < 0.2) this.camera.shake = 0;
      }

      this.updateHUD();
    }

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Camera shake offsets
      const shakeX = (Math.random() - 0.5) * this.camera.shake * 2;
      const shakeY = (Math.random() - 0.5) * this.camera.shake * 2;

      ctx.save();
      ctx.translate(-Math.round(this.camera.x + shakeX), -Math.round(this.camera.y + shakeY));

      // 1. Atmospheric Background Grid & Distant Rock Silhouettes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Subtle parallax grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < WORLD_WIDTH; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < WORLD_HEIGHT; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD_WIDTH, y);
        ctx.stroke();
      }

      // 2. Render Platforms (Clean rocky styling with grass tops)
      for (const p of platforms) {
        if (p.type === 'crate') {
          // Destructible / cover crate
          ctx.fillStyle = '#78350f';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.w, p.h);
          // X pattern on crate
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.w, p.y + p.h);
          ctx.moveTo(p.x + p.w, p.y);
          ctx.lineTo(p.x, p.y + p.h);
          ctx.stroke();
        } else {
          // Rock island body
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.w, p.h);

          // Lush grass edge on top of rock platforms
          if (p.type === 'rock' || p.type === 'ground') {
            ctx.fillStyle = '#15803d';
            ctx.fillRect(p.x, p.y, p.w, 6);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(p.x, p.y, p.w, 2);
          }
        }
      }

      // 3. Render Bullet Shells
      bulletShells.forEach(sh => sh.draw(ctx));

      // 4. Render Pickups
      this.pickups.forEach(p => p.draw(ctx));

      // 5. Render Grenades
      this.grenades.forEach(g => g.draw(ctx));

      // 6. Render Bullets & Rockets
      this.bullets.forEach(b => b.draw(ctx));

      // 7. Render Soldiers (Bots + Player)
      this.bots.forEach(bot => bot.draw(ctx));
      if (this.player) this.player.draw(ctx);

      // 8. Render Particles (Smoke, Blood, Flashes)
      particles.forEach(pt => pt.draw(ctx));

      // 8b. Render Floating Damage Numbers
      floatingTexts.forEach(ft => ft.draw(ctx));

      ctx.restore();

      // 9. Edge-of-Screen Enemy Indicator Radar (Classic Mini Militia Feature)
      this.renderRadarIndicators(ctx);
    }

    renderRadarIndicators(ctx) {
      if (!this.player || !this.player.alive) return;
      const screenMargin = 30;

      this.bots.forEach(bot => {
        if (!bot.alive) return;
        const screenX = bot.x - this.camera.x;
        const screenY = bot.y - this.camera.y;

        // Only draw indicator if bot is outside camera viewport
        const isOffscreen = screenX < 0 || screenX > this.canvas.width || screenY < 0 || screenY > this.canvas.height;
        if (isOffscreen) {
          const cx = this.canvas.width / 2;
          const cy = this.canvas.height / 2;
          const angle = Math.atan2(screenY - cy, screenX - cx);

          const edgeX = Math.max(screenMargin, Math.min(this.canvas.width - screenMargin, cx + Math.cos(angle) * (this.canvas.width * 0.46)));
          const edgeY = Math.max(screenMargin, Math.min(this.canvas.height - screenMargin, cy + Math.sin(angle) * (this.canvas.height * 0.44)));

          ctx.save();
          ctx.translate(edgeX, edgeY);
          ctx.rotate(angle);

          // Radar pointer arrow
          ctx.fillStyle = bot.color;
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(-8, -6);
          ctx.lineTo(-4, 0);
          ctx.lineTo(-8, 6);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });
    }

    animate() {
      this.update();
      this.render();
      requestAnimationFrame(this.animate);
    }
  }

  // Initialize game on load
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
  });
})();
