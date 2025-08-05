import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { LightingSystem } from './systems/LightingSystem';
import { InteractionSystem } from './systems/InteractionSystem';
import { Button3D } from './components/Button3D';

export class App {
  constructor() {
    this.initScene();
    this.initSystems();
    this.createUIComponents();
  }

  initScene() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    
    // Renderer with antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    
    // Post-processing setup
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    
    // SSAO Pass
    this.ssaoPass = new SSAOPass(this.scene, this.camera);
    this.ssaoPass.kernelRadius = 0.5;
    this.ssaoPass.minDistance = 0.0001;
    this.ssaoPass.maxDistance = 0.01;
    this.composer.addPass(this.ssaoPass);
    
    // Volumetric light pass would be added here
  }

  initSystems() {
    this.lightingSystem = new LightingSystem(this.scene);
    this.interactionSystem = new InteractionSystem(this.scene, this.camera, this.renderer.domElement);
  }

  createUIComponents() {
    // Example button
    this.button = new Button3D({
      text: 'Click Me',
      position: new THREE.Vector3(0, 0, 0),
      onClick: () => console.log('Button clicked!')
    });
    this.scene.add(this.button.mesh);
    
    // Add more UI components as needed
  }

  update() {
    this.lightingSystem.update();
    this.interactionSystem.update();
    this.composer.render();
  }
}

// In App.js, enhance the SSAO pass setup
this.ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
this.ssaoPass.kernelRadius = 0.5;
this.ssaoPass.minDistance = 0.0001;
this.ssaoPass.maxDistance = 0.01;
this.ssaoPass.output = SSAOPass.OUTPUT.Default;

// Configure kernel and noise
this.ssaoPass.kernelSize = 32;
this.ssaoPass.noiseTexture = this.generateNoiseTexture(4);
this.composer.addPass(this.ssaoPass);

// Helper method to generate noise texture
generateNoiseTexture(size) {
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size * 3; i++) {
    data[i] = Math.random() * 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

// In App.js, enhance the SSAO pass setup
this.ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
this.ssaoPass.kernelRadius = 0.5;
this.ssaoPass.minDistance = 0.0001;
this.ssaoPass.maxDistance = 0.01;
this.ssaoPass.output = SSAOPass.OUTPUT.Default;

// Configure kernel and noise
this.ssaoPass.kernelSize = 32;
this.ssaoPass.noiseTexture = this.generateNoiseTexture(4);
this.composer.addPass(this.ssaoPass);

// Helper method to generate noise texture
generateNoiseTexture(size) {
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size * 3; i++) {
    data[i] = Math.random() * 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

// For multiple buttons or cards
const buttonGeometry = new THREE.RoundedBoxGeometry(2, 0.8, 0.2, 5, 0.1);
const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x4a6cf7 });
const buttonMesh = new THREE.InstancedMesh(buttonGeometry, buttonMaterial, 100);

// Set positions for each instance
const dummy = new THREE.Object3D();
for (let i = 0; i < 100; i++) {
  dummy.position.set((i % 10) * 2.5 - 12.5, Math.floor(i / 10) * -1.5 + 5, 0);
  dummy.updateMatrix();
  buttonMesh.setMatrixAt(i, dummy.matrix);
}
this.scene.add(buttonMesh);

const lod = new THREE.LOD();

// High detail (close to camera)
const highDetailGeometry = new THREE.BoxGeometry(2, 0.8, 0.2, 32, 32);
const highDetailMesh = new THREE.Mesh(highDetailGeometry, material);
lod.addLevel(highDetailMesh, 0);

// Medium detail
const medDetailGeometry = new THREE.BoxGeometry(2, 0.8, 0.2, 16, 16);
const medDetailMesh = new THREE.Mesh(medDetailGeometry, material);
lod.addLevel(medDetailMesh, 10);

// Low detail (far from camera)
const lowDetailGeometry = new THREE.BoxGeometry(2, 0.8, 0.2, 8, 8);
const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, material);
lod.addLevel(lowDetailMesh, 20);

this.scene.add(lod);



