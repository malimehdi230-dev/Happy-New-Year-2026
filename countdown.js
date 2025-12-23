// ═══════════════════════════════════════════════════════════════
// ⏰ COUNTDOWN SYSTEM
// ═══════════════════════════════════════════════════════════════

function getNewYearDate() {
    const now = new Date();
    let year = now.getFullYear();
    
    // If we're past New Year's, use next year
    const newYear = new Date(year + 1, 0, 1, 0, 0, 0);
    return newYear;
}

function updateCountdown() {
    const now = new Date();
    const newYear = getNewYearDate();
    const diff = newYear - now;

    if (diff <= 0 && !state.isNewYear) {
        triggerNewYear();
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const totalSeconds = Math.floor(diff / 1000);
    const container = document.getElementById('countdown-container');

    // Final 10 seconds effects
    if (totalSeconds <= 10 && totalSeconds > 0) {
        container.classList.add('final-countdown');
        state.cameraZoom = 1 + (10 - totalSeconds) * 0.02;
        
        if (totalSeconds <= 5) {
            document.body.classList.add('screen-shake');
            setTimeout(() => document.body.classList.remove('screen-shake'), 100);
        }
    } else {
        container.classList.remove('final-countdown');
    }

    // Update display with animation
    updateTimeUnit('days', days);
    updateTimeUnit('hours', hours);
    updateTimeUnit('minutes', minutes);
    updateTimeUnit('seconds', seconds);

    // Pulse effect on seconds change
    const secondsBox = document.getElementById('seconds-box');
    secondsBox.classList.remove('pulse-glow');
    void secondsBox.offsetWidth;
    secondsBox.classList.add('pulse-glow');
}

function updateTimeUnit(id, value) {
    const element = document.getElementById(id);
    const newValue = value.toString().padStart(2, '0');
    
    if (element.textContent !== newValue) {
        gsap.to(element, {
            duration: 0.3,
            rotationX: 360,
            ease: "power2.out",
            onComplete: () => {
                element.textContent = newValue;
                gsap.set(element, { rotationX: 0 });
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎉 NEW YEAR CELEBRATION
// ═══════════════════════════════════════════════════════════════

function triggerNewYear() {
    if (state.isNewYear) return;
    state.isNewYear = true;
    state.isCelebrating = true;

    audio.playNewYearBass();

    // Hide countdown
    gsap.to('#countdown-container', {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.in"
    });

    // Massive fireworks
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            spawnRandomFirework();
            if (Math.random() > 0.5) spawnFirework((Math.random() - 0.5) * 200, Math.random() * 80, true);
        }, i * 100);
    }

    // Camera shake
    gsap.to(camera.position, {
        x: "+=5",
        y: "+=3",
        duration: 0.1,
        yoyo: true,
        repeat: 10,
        ease: "power2.inOut"
    });

    // Start confetti
    startConfetti();

    // Show New Year message
    setTimeout(() => {
        const message = document.getElementById('new-year-message');
        message.style.opacity = '1';
        
        gsap.fromTo(message, 
            { scale: 0, rotationY: -180 },
            { 
                scale: 1, 
                rotationY: 0, 
                duration: 1.5, 
                ease: "elastic.out(1, 0.5)" 
            }
        );

        gsap.fromTo('.new-year-text', 
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
        );

        gsap.fromTo('.year-number', 
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, delay: 0.8, ease: "elastic.out(1, 0.3)" }
        );
    }, 1500);

    // Continue celebration
    const celebrationInterval = setInterval(() => {
        if (state.isCelebrating) {
            for (let i = 0; i < state.fireworkIntensity; i++) {
                spawnRandomFirework();
            }
        }
    }, 500);

    // End intense celebration after 30 seconds
    setTimeout(() => {
        state.isCelebrating = false;
        clearInterval(celebrationInterval);
    }, 30000);
}

function replayNewYear() {
    state.isNewYear = false;
    state.isCelebrating = false;
    
    document.getElementById('new-year-message').style.opacity = '0';
    document.getElementById('countdown-container').style.opacity = '1';
    
    confetti.length = 0;
    
    setTimeout(() => {
        triggerNewYear();
    }, 500);
}