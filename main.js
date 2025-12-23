// ═══════════════════════════════════════════════════════════════
// 🎬 MAIN ANIMATION LOOP
// ═══════════════════════════════════════════════════════════════

function animate() {
    requestAnimationFrame(animate);

    animateScene();
    updateFireworks();
    updateConfetti();

    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════════════
// 🖱️ EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════

function handleMouseMove(e) {
    state.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    state.targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
}

function handleClick(e) {
    if (!state.isStarted) return;
    
    const x = (e.clientX / window.innerWidth - 0.5) * 200;
    const y = ((1 - e.clientY / window.innerHeight) - 0.5) * 100 + 50;
    
    spawnFirework(x, y, state.isNewYear);
}

function handleTouch(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    }
}

function handleDeviceMotion(e) {
    const acceleration = e.accelerationIncludingGravity;
    if (!acceleration) return;
    
    const shakeThreshold = 30;
    const now = Date.now();
    
    if (Math.abs(acceleration.x) > shakeThreshold || 
        Math.abs(acceleration.y) > shakeThreshold) {
        if (now - state.lastShake > 1000) {
            state.lastShake = now;
            // Mega fireworks on shake
            for (let i = 0; i < 10; i++) {
                setTimeout(() => spawnRandomFirework(), i * 50);
            }
        }
    }
}

function handleDeviceOrientation(e) {
    if (e.gamma && e.beta) {
        state.targetMouseX = e.gamma / 45;
        state.targetMouseY = (e.beta - 45) / 45;
    }
}

function handleResizeAll() {
    handleResize();
    resizeConfettiCanvas();
}

// ═══════════════════════════════════════════════════════════════
// 🎮 SECRET ULTRA MODE (Konami Code)
// ═══════════════════════════════════════════════════════════════

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

function handleKeydown(e) {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateUltraMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
}

function activateUltraMode() {
    state.ultraMode = !state.ultraMode;
    state.fireworkIntensity = state.ultraMode ? 10 : 5;
    
    if (state.ultraMode) {
        document.body.style.filter = 'saturate(1.5) contrast(1.1)';
        for (let i = 0; i < 50; i++) {
            setTimeout(() => spawnRandomFirework(), i * 30);
        }
    } else {
        document.body.style.filter = 'none';
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎛️ UI CONTROLS
// ═══════════════════════════════════════════════════════════════

function initUI() {
    // Sound toggle
    document.getElementById('sound-btn').addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        document.getElementById('sound-btn').textContent = state.soundEnabled ? '🔊' : '🔇';
        if (state.soundEnabled) {
            audio.init();
            audio.playAmbient();
        }
    });

    // Fireworks toggle
    document.getElementById('fireworks-btn').addEventListener('click', () => {
        const panel = document.getElementById('intensity-panel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    });

    // Intensity slider
    document.getElementById('intensity-slider').addEventListener('input', (e) => {
        state.fireworkIntensity = parseInt(e.target.value);
    });

    // Aurora toggle
    document.getElementById('aurora-btn').addEventListener('click', () => {
        state.auroraEnabled = !state.auroraEnabled;
        document.getElementById('aurora').style.opacity = state.auroraEnabled ? '0.4' : '0';
        document.getElementById('aurora-btn').style.opacity = state.auroraEnabled ? '1' : '0.5';
    });

    // Replay button
    document.getElementById('replay-btn').addEventListener('click', replayNewYear);
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function init() {
    resizeConfettiCanvas();
    initThree();
    initUI();

    // Event listeners
    window.addEventListener('resize', handleResizeAll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('keydown', handleKeydown);

    // Device orientation/motion for mobile
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleDeviceMotion);
    }

    // Start countdown
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Start animation
    animate();
}

// Start overlay
document.getElementById('start-overlay').addEventListener('click', function() {
    this.style.transition = 'opacity 1s ease';
    this.style.opacity = '0';
    
    setTimeout(() => {
        this.style.display = 'none';
        state.isStarted = true;
        
        // Initialize audio context on user interaction
        audio.init();
        
        // Initial fireworks burst
        for (let i = 0; i < 5; i++) {
            setTimeout(() => spawnRandomFirework(), i * 200);
        }
    }, 500);
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);