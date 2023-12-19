import * as THREE from 'three';
import { Noise } from 'noisejs';
const noise = new Noise(Math.random());

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const particlesCount = 50000; // Number of particles
const particlesGeometry = new THREE.BufferGeometry();
const posArray = new Float32Array(particlesCount * 3);
const originalPosArray = new Float32Array(particlesCount * 3); // Store original positions

for (let i = 0; i < particlesCount; i++) {
    // Spherical coordinates
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.sqrt(particlesCount * Math.PI) * phi;

    // Cartesian coordinates
    posArray[i * 3] = Math.cos(theta) * Math.sin(phi); // x
    posArray[i * 3 + 1] = Math.sin(theta) * Math.sin(phi); // y
    posArray[i * 3 + 2] = Math.cos(phi); // z

    originalPosArray[i * 3] = posArray[i * 3];
    originalPosArray[i * 3 + 1] = posArray[i * 3 + 1];
    originalPosArray[i * 3 + 2] = posArray[i * 3 + 2];
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPosArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.001,
    color: 0xffffff,
    transparent: true, // Enable transparency
    blending: THREE.AdditiveBlending, // Use a
});

const particleSphere = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSphere);

const mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    const positions = particlesGeometry.attributes.position.array;
    const originalPositions = particlesGeometry.attributes.originalPosition.array; // Use original positions

    const time = Date.now() * 0.00005;
    const noiseFactor = 0.006; // Adjust this factor to control the strength of the noise effect
    const floatingFactor = 0.01; // Adjust this factor to control the strength of the floating effect

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        // Apply noise effect
        positions[i3] += noise.simplex3(x, y, time) * 0.1 * noiseFactor;
        positions[i3 + 1] += noise.simplex3(y, z, time) * 0.1 * noiseFactor;
        positions[i3 + 2] += noise.simplex3(x, z, time) * 0.1 * noiseFactor;

        // Apply natural floating effect
        positions[i3] += (Math.random() - 0.5) * floatingFactor;
        positions[i3 + 1] += (Math.random() - 0.5) * floatingFactor;
        positions[i3 + 2] += (Math.random() - 0.5) * floatingFactor;
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}



animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
