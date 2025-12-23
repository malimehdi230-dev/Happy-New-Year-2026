// ═══════════════════════════════════════════════════════════════
// 🎬 THREE.JS SCENE SETUP
// ═══════════════════════════════════════════════════════════════

let scene, camera, renderer;
let starField, holoCubes = [];

function initThree() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000011, 0.0008);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 100;

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000011, 1);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 1, 500);
    pointLight.position.set(0, 50, 50);
    scene.add(pointLight);

    // Create scene elements
    createStarField();
    createHoloCubes();
    createFloorReflection();
}

// ═══════════════════════════════════════════════════════════════
// ⭐ STAR FIELD
// ═══════════════════════════════════════════════════════════════

function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        const color = new THREE.Color();
        color.setHSL(0.1 + Math.random() * 0.1, 0.2, 0.8 + Math.random() * 0.2);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

// ═══════════════════════════════════════════════════════════════
// 📦 HOLOGRAPHIC CUBES
// ═══════════════════════════════════════════════════════════════

function createHoloCubes() {
    const cubeCount = 15;
    
    for (let i = 0; i < cubeCount; i++) {
        const size = Math.random() * 5 + 2;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const edges = new THREE.EdgesGeometry(geometry);
        
        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.7, 0.6);
        
        const material = new THREE.LineBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.4
        });
        
        const cube = new THREE.LineSegments(edges, material);
        cube.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 100 - 50
        );
        
        cube.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(cube);
        holoCubes.push(cube);
    }
}

// ═══════════════════════════════════════════════════════════════
// 🪞 FLOOR REFLECTION
// ═══════════════════════════════════════════════════════════════

function createFloorReflection() {
    const geometry = new THREE.PlaneGeometry(2000, 2000);
    const material = new THREE.MeshBasicMaterial({
        color: 0x111122,
        transparent: true,
        opacity: 0.3
    });
    
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -100;
    scene.add(floor);
}

// ═══════════════════════════════════════════════════════════════
// 🎬 SCENE ANIMATION
// ═══════════════════════════════════════════════════════════════

function animateScene() {
    // Smooth mouse following
    state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
    state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

    // Camera movement
    camera.position.x = state.mouseX * 20;
    camera.position.y = state.mouseY * 10;
    camera.lookAt(0, 0, 0);
    camera.position.z = 100 / state.cameraZoom;

    // Rotate star field
    if (starField) {
        starField.rotation.y += 0.0001;
        starField.rotation.x += 0.00005;
    }

    // Animate holo cubes
    const time = Date.now() * 0.001;
    holoCubes.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;
        
        cube.position.y += Math.sin(time * cube.userData.floatSpeed + cube.userData.floatOffset) * 0.02;
    });
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}