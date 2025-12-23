// ═══════════════════════════════════════════════════════════════
// 🎆 CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    targetYear: 2026,
    maxParticles: 3000,
    fireworkColors: [
        0xff6b6b, 0xffd700, 0x4ecdc4, 0x45b7d1, 0x96ceb4,
        0xffeaa7, 0xdfe6e9, 0xff7675, 0x74b9ff, 0xa29bfe,
        0xfd79a8, 0x00b894, 0xe17055, 0x0984e3, 0x6c5ce7
    ],
    goldenColors: [0xffd700, 0xffec8b, 0xdaa520, 0xff8c00, 0xffa500]
};

// ═══════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

const state = {
    isStarted: false,
    isNewYear: false,
    isCelebrating: false,
    soundEnabled: false,
    auroraEnabled: true,
    fireworksEnabled: true,
    fireworkIntensity: 5,
    ultraMode: false,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    cameraZoom: 1,
    lastShake: 0
};