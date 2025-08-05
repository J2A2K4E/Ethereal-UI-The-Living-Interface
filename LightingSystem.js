import * as THREE from 'three';

export class LightingSystem {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    // Ambient light for base illumination
    this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(this.ambientLight);
    
    // Directional light for main shadows
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(5, 10, 7);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(this.directionalLight);
    
    // Hemisphere light for natural outdoor effect
    this.hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
    this.scene.add(this.hemiLight);
    
    // Point lights for interactive highlights
    this.interactiveLights = [];
    for (let i = 0; i < 3; i++) {
      const light = new THREE.PointLight(0x4a6cf7, 0.5, 10);
      light.visible = false;
      this.scene.add(light);
      this.interactiveLights.push(light);
    }
    
    // Volumetric light effect
    this.createVolumetricLight();
  }

  createVolumetricLight() {
    // Create a volumetric light cone
    const geometry = new THREE.ConeGeometry(2, 5, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4a6cf7,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    
    this.volumetricLight = new THREE.Mesh(geometry, material);
    this.volumetricLight.position.set(0, 0, -5);
    this.volumetricLight.rotation.x = Math.PI;
    this.scene.add(this.volumetricLight);
  }

  update(time) {
    // Animate lights slightly for a "living" feel
    this.directionalLight.position.x = 5 + Math.sin(time * 0.001) * 0.5;
    this.directionalLight.position.y = 10 + Math.cos(time * 0.0007) * 0.3;
    
    // Update volumetric light intensity
    if (this.volumetricLight.material) {
      this.volumetricLight.material.opacity = 0.1 + Math.sin(time * 0.002) * 0.05;
    }
  }
}
