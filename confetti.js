// ═══════════════════════════════════════════════════════════════
// 🎊 CONFETTI SYSTEM
// ═══════════════════════════════════════════════════════════════

const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
const confetti = [];

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

class Confetto {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.color = `hsl(${Math.random() * 60 + 30}, 100%, 60%)`;
        this.opacity = 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedX += (Math.random() - 0.5) * 0.1;
        
        if (this.y > confettiCanvas.height + 20) {
            if (state.isCelebrating) {
                this.reset();
            } else {
                this.opacity -= 0.02;
            }
        }
    }

    draw() {
        if (this.opacity <= 0) return;
        
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation * Math.PI / 180);
        confettiCtx.globalAlpha = this.opacity;
        confettiCtx.fillStyle = this.color;
        confettiCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        confettiCtx.restore();
    }
}

function startConfetti() {
    for (let i = 0; i < 200; i++) {
        const c = new Confetto();
        c.y = Math.random() * confettiCanvas.height;
        confetti.push(c);
    }
}

function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    for (let i = confetti.length - 1; i >= 0; i--) {
        confetti[i].update();
        confetti[i].draw();
        
        if (confetti[i].opacity <= 0) {
            confetti.splice(i, 1);
        }
    }
}