const BGM_PATTERNS = {
  map: {
    tempoMs: 360,
    type: 'sine',
    gain: 0.042,
    notes: [261.6, 329.6, 392.0, 493.9, 392.0, 329.6, 293.7, 349.2, 440.0, 392.0, 349.2, 329.6],
  },
  combat: {
    tempoMs: 190,
    type: 'triangle',
    gain: 0.055,
    notes: [146.8, 146.8, 220.0, 196.0, 174.6, 164.8, 146.8, 293.7, 261.6, 220.0, 196.0, 174.6],
  },
  romance: {
    tempoMs: 420,
    type: 'sine',
    gain: 0.048,
    notes: [523.3, 659.3, 784.0, 659.3, 587.3, 698.5, 880.0, 784.0, 659.3, 587.3, 523.3, 659.3],
  },
  victory: {
    tempoMs: 300,
    type: 'triangle',
    gain: 0.052,
    notes: [523.3, 659.3, 784.0, 1046.5, 880.0, 784.0, 659.3, 784.0, 1046.5, 987.8, 880.0, 784.0],
  },
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmEnabled = true;
    this.bgmMode = 'none';
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTone(freq, type, duration, gainVal = 0.15, delay = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playBgmNote(freq, type, duration, gainVal) {
    if (!this.bgmEnabled || !this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  setBgm(mode) {
    const next = mode || 'none';
    if (this.bgmMode === next && this.bgmTimer) return;
    this.bgmMode = next;
    clearInterval(this.bgmTimer);
    this.bgmTimer = null;
    if (!this.bgmEnabled || next === 'none' || !BGM_PATTERNS[next]) return;

    const pat = BGM_PATTERNS[next];
    this.bgmStep = 0;
    this.bgmTimer = setInterval(() => {
      if (!this.bgmEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const freq = pat.notes[this.bgmStep % pat.notes.length];
      this.playBgmNote(freq, pat.type, (pat.tempoMs / 1000) * 1.15, pat.gain);
      this.bgmStep += 1;
    }, pat.tempoMs);
  }

  stopBgm() {
    clearInterval(this.bgmTimer);
    this.bgmTimer = null;
  }

  click() {
    this.playTone(520, 'triangle', 0.05, 0.1);
  }

  hit(isCrit = false) {
    if (isCrit) {
      this.playTone(180, 'sawtooth', 0.12, 0.2, 0);
      this.playTone(320, 'square', 0.15, 0.18, 0.05);
      this.playTone(680, 'triangle', 0.18, 0.16, 0.09);
    } else {
      this.playTone(160, 'sawtooth', 0.1, 0.16, 0);
      this.playTone(260, 'triangle', 0.1, 0.12, 0.03);
    }
  }

  damage() {
    this.playTone(140, 'sawtooth', 0.14, 0.18, 0);
    this.playTone(95, 'sawtooth', 0.2, 0.18, 0.08);
  }

  dice() {
    this.playTone(400, 'square', 0.04, 0.07, 0);
    this.playTone(520, 'square', 0.04, 0.07, 0.06);
    this.playTone(640, 'square', 0.05, 0.08, 0.12);
  }

  powerup() {
    this.playTone(440, 'triangle', 0.1, 0.12, 0);
    this.playTone(554, 'triangle', 0.1, 0.12, 0.08);
    this.playTone(659, 'triangle', 0.14, 0.14, 0.16);
    this.playTone(880, 'triangle', 0.25, 0.15, 0.24);
  }

  victory() {
    this.playTone(523, 'triangle', 0.12, 0.14, 0);
    this.playTone(659, 'triangle', 0.12, 0.14, 0.1);
    this.playTone(784, 'triangle', 0.12, 0.14, 0.2);
    this.playTone(1046, 'triangle', 0.35, 0.18, 0.3);
  }
}

export const sfx = new SoundEngine();
