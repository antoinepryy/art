import * as THREE from 'three';
let waveSpeed = 6.5; // Speed of the wave effect
let waveAmplitude = 0.007; // Amplitude of the wave effect

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const particleGeometry = new THREE.BufferGeometry();
const particlesCount = 5000; // Number of particles
const planetGeometry = new THREE.BufferGeometry();
const planetParticlesCount = 5000; // Number of particles for the planet
const baseRadius = 1.5; // Base radius of the planet


const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    // Random positions for particles
    posArray[i] = (Math.random() - 0.5) * 10;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.00001,
    transparent: true
});
const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleMesh);



const planetPosArray = new Float32Array(planetParticlesCount * 3);


for (let i = 0; i < planetParticlesCount; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos((2 * Math.random()) - 1);

    // Spherical to Cartesian conversion
    planetPosArray[i * 3] = baseRadius * Math.sin(phi) * Math.cos(theta); // x
    planetPosArray[i * 3 + 1] = baseRadius * Math.sin(phi) * Math.sin(theta); // y
    planetPosArray[i * 3 + 2] = baseRadius * Math.cos(phi); // z
}


planetGeometry.setAttribute('position', new THREE.BufferAttribute(planetPosArray, 3));

const planetMaterial = new THREE.PointsMaterial({
    size: 0.009,
    color: 0xFF0000, // Green color, you can change as needed
    transparent: false
});
const planetMesh = new THREE.Points(planetGeometry, planetMaterial);
scene.add(planetMesh);

function animate() {
    requestAnimationFrame(animate);

    const positions = planetMesh.geometry.attributes.position.array;
    for (let i = 0; i < planetParticlesCount; i++) {
        // Apply wave effect
        const offset = Math.sin(waveSpeed * Date.now() * 0.001 + (i * 3)) * waveAmplitude;
        const finalRadius = baseRadius + offset;

        positions[i * 3] *= finalRadius / baseRadius; // x
        positions[i * 3 + 1] *= finalRadius / baseRadius; // y
        positions[i * 3 + 2] *= finalRadius / baseRadius; // z
    }

    // Notify Three.js that the position attribute needs to be updated
    planetMesh.geometry.attributes.position.needsUpdate = true;

    planetMesh.rotation.y += 0.002;
    particleMesh.rotation.y += 0.0009;

    renderer.render(scene, camera);
}


animate();
