/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEffectsController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Initialized lazily on first user gesture to prevent browser autoplay blocks
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  // Plays a crisp, satisfying mechanical peg tick sound
  playTick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Low crisp click frequency decaying extremely fast
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Plays an uplifting positive synth fanfare when user wins!
  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Synthesize 4 notes sequentially (C4, E4, G4, C5)
      const notes = [261.63, 329.63, 392.00, 523.25];
      const duration = 0.15;
      const spacing = 0.08;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + idx * spacing;
        const endTime = startTime + duration;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch (e) {
      console.warn('AudioContext fanfare failed:', e);
    }
  }

  // Plays a rich rumble shake sound to emulate a heavy box/crate vibrating
  playChestShake() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Synthesize 6 quick successive base rumbles to sound like a creaking/vibrating crate
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        // Base frequency decreases on every vibration cycle
        osc.frequency.setValueAtTime(120 - i * 8, now + i * 0.14);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now + i * 0.14);

        const startTime = now + i * 0.14;
        const duration = 0.11;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.01);
      }
    } catch (e) {
      console.warn('AudioContext shake failed:', e);
    }
  }
}

export const SoundEffects = new SoundEffectsController();
