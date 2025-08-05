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
