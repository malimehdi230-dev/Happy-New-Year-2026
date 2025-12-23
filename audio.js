// ═══════════════════════════════════════════════════════════════
// 🔊 AUDIO SYSTEM
// ═══════════════════════════════════════════════════════════════

class AudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.3;
        this.initialized = true;
    }

    playBoom(intensity = 1) {
        if (!this.initialized || !state.soundEnabled) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80 * intensity, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.5);
        
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        
        gain.gain.setValueAtTime(0.5 * intensity, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    playCrackle() {
        if (!this.initialized || !state.soundEnabled) return;
        
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        source.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        
        gain.gain.value = 0.15;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        source.start();
    }

    playNewYearBass() {
        if (!this.initialized || !state.soundEnabled) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 2);
        
        gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 2);
    }

    playAmbient() {
        if (!this.initialized || !state.soundEnabled) return;
        
        // Soft pad sound
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 220;
        osc2.frequency.value = 330;
        
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        gain.gain.value = 0.05;
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc1.start();
        osc2.start();
        
        // Fade out after 5 seconds
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 5);
        setTimeout(() => {
            osc1.stop();
            osc2.stop();
        }, 5000);
    }

    setVolume(val) {
        if (this.masterGain) {
            this.masterGain.gain.value = val;
        }
    }
}

const audio = new AudioSystem();