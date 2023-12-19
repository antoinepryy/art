import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const particlesMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.01,
    transparent: true,
    blending: THREE.AdditiveBlending
});
const basePairMaterial = new THREE.PointsMaterial({
    color: 0x0099FF,
    size: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending
});
const particlesCount = 10000;

function createHelixCurve(turns, turnHeight, radius, angleOffset, pointsPerTurn) {
    const points = [];
    // Increase the number of points for smoother curves
    for (let i = 0; i <= turns * pointsPerTurn; i++) {
        const turnFraction = i / pointsPerTurn;
        const angle = (turnFraction / turns) * Math.PI * 2 + angleOffset;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = turnHeight * turnFraction;
        points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
}



function createParticlesAlongPath(path, material, particlesCount) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const t = i / (particlesCount - 1);
        const position = path.getPointAt(t);
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(geometry, material);
}

function createBasePairParticles(path1, path2, material, particlesCount) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const t = i / particlesCount;
        const position1 = path1.getPointAt(t);
        const position2 = path2.getPointAt(t);
        const midPoint = position1.clone().lerp(position2, 0.5);
        positions[i * 3] = midPoint.x;
        positions[i * 3 + 1] = midPoint.y;
        positions[i * 3 + 2] = midPoint.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(geometry, material);
}

function setupBloomEffect(renderer, scene, camera) {
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1;
    bloomPass.radius = 1;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    return composer;
}
const dnaGroup = new THREE.Group();

const helixPath1 = createHelixCurve(500, 0.2, 5, 0, 1000); // 50 turns, 0.2 units of height per turn, 100 points per turn
const helixPath2 = createHelixCurve(500, 0.2, 5, Math.PI, 1000); // Offset by PI for the second helix

const dnaParticles1 = createParticlesAlongPath(helixPath1, particlesMaterial, particlesCount);
const dnaParticles2 = createParticlesAlongPath(helixPath2, particlesMaterial, particlesCount);
scene.add(dnaParticles1);
scene.add(dnaParticles2);
dnaGroup.add(dnaParticles1);
dnaGroup.add(dnaParticles2);
const basePairParticles = createBasePairParticles(helixPath1, helixPath2, basePairMaterial, particlesCount);
dnaGroup.add(basePairParticles);

scene.add(dnaGroup);

const composer = setupBloomEffect(renderer, scene, camera);

function animate() {
    requestAnimationFrame(animate);
    dnaGroup.rotation.z += 0.01;
    dnaGroup.position.z -= 0.01;
    // dnaGroup.position.z -= 0.01;
    dnaGroup.rotation.y += 0.01;

    composer.render();
}

animate();
