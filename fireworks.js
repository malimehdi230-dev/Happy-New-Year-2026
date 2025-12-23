// ═══════════════════════════════════════════════════════════════
// 🎆 FIREWORK SYSTEM
// ═══════════════════════════════════════════════════════════════

const fireworks = [];

class Firework {
    constructor(x, y, z, color, isGolden = false) {
        this.origin = new THREE.Vector3(x, y, z);
        this.particles = [];
        this.isExploded = false;
        this.isGolden = isGolden;
        this.life = 0;
        this.maxLife = 150;
        
        // Launch particle
        this.rocketGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        this.rocketMaterial = new THREE.MeshBasicMaterial({ 
            color: isGolden ? 0xffd700 : color 
        });
        this.rocket = new THREE.Mesh(this.rocketGeometry, this.rocketMaterial);
        this.rocket.position.copy(this.origin);
        this.rocket.position.y = -100;
        
        this.targetY = y + Math.random() * 50;
        this.rocketSpeed = 2 + Math.random() * 2;
        this.color = color;
        
        scene.add(this.rocket);
    }

    update() {
        this.life++;
        
        if (!this.isExploded) {
            this.rocket.position.y += this.rocketSpeed;
            
            if (this.rocket.position.y >= this.targetY) {
                this.explode();
            }
        } else {
            this.updateParticles();
        }
        
        return this.life < this.maxLife;
    }

    explode() {
        this.isExploded = true;
        scene.remove(this.rocket);
        
        audio.playBoom(this.isGolden ? 1.5 : 1);
        audio.playCrackle();
        
        const particleCount = this.isGolden ? 150 : 80 + Math.floor(Math.random() * 40);
        const colors = this.isGolden ? CONFIG.goldenColors : CONFIG.fireworkColors;
        
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = (Math.random() * 2 + 1) * (this.isGolden ? 1.5 : 1);
            
            const velocity = new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed,
                Math.cos(phi) * speed
            );
            
            const particleGeometry = new THREE.SphereGeometry(
                this.isGolden ? 0.4 : 0.3, 
                4, 4
            );
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(this.rocket.position);
            particle.userData.velocity = velocity;
            particle.userData.life = 0;
            
            scene.add(particle);
            this.particles.push(particle);
        }
    }

    updateParticles() {
        const gravity = 0.02;
        const drag = 0.98;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.userData.life++;
            
            particle.userData.velocity.y -= gravity;
            particle.userData.velocity.multiplyScalar(drag);
            
            particle.position.add(particle.userData.velocity);
            
            const lifeRatio = particle.userData.life / 100;
            particle.material.opacity = Math.max(0, 1 - lifeRatio);
            particle.scale.setScalar(Math.max(0.1, 1 - lifeRatio * 0.5));
            
            if (particle.material.opacity <= 0) {
                scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                this.particles.splice(i, 1);
            }
        }
    }

    dispose() {
        if (this.rocket.parent) {
            scene.remove(this.rocket);
        }
        this.rocketGeometry.dispose();
        this.rocketMaterial.dispose();
        
        this.particles.forEach(p => {
            scene.remove(p);
            p.geometry.dispose();
            p.material.dispose();
        });
    }
}

function spawnFirework(x, y, isGolden = false) {
    if (!state.fireworksEnabled) return;
    
    const color = CONFIG.fireworkColors[Math.floor(Math.random() * CONFIG.fireworkColors.length)];
    const firework = new Firework(x, y, -50, color, isGolden);
    fireworks.push(firework);
}

function spawnRandomFirework() {
    const x = (Math.random() - 0.5) * 200;
    const y = Math.random() * 50 + 20;
    spawnFirework(x, y, state.isNewYear && Math.random() > 0.5);
}

function updateFireworks() {
    // Update fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const alive = fireworks[i].update();
        if (!alive) {
            fireworks[i].dispose();
            fireworks.splice(i, 1);
        }
    }

    // Ambient fireworks
    if (state.fireworksEnabled && Math.random() < 0.01 * (state.fireworkIntensity / 5)) {
        spawnRandomFirework();
    }
}