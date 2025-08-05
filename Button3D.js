import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export class Button3D {
  constructor(options) {
    this.options = options;
    this.init();
  }

  async init() {
    // Load font for button text
    const fontLoader = new FontLoader();
    this.font = await new Promise(resolve => {
      fontLoader.load('assets/fonts/helvetiker_regular.typeface.json', resolve);
    });

    // Create button mesh
    this.createButtonMesh();
    this.createTextMesh();
    
    // Combine into a single mesh group
    this.mesh = new THREE.Group();
    this.mesh.add(this.buttonMesh);
    this.mesh.add(this.textMesh);
    this.mesh.position.copy(this.options.position);
    
    // Set up hover and click states
    this.isHovered = false;
    this.isActive = false;
  }

  createButtonMesh() {
    const geometry = new THREE.RoundedBoxGeometry(2, 0.8, 0.2, 5, 0.1);
    
    // Custom shader material for glowing effect
    this.buttonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        hoverState: { value: 0 },
        activeState: { value: 0 },
        baseColor: { value: new THREE.Color(0x4a6cf7) },
        glowColor: { value: new THREE.Color(0x7d9eff) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float hoverState;
        uniform float activeState;
        uniform vec3 baseColor;
        uniform vec3 glowColor;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Base color with subtle animation
          vec3 color = mix(baseColor, glowColor, hoverState * 0.5 + activeState * 0.3);
          
          // Edge glow effect
          float edge = smoothstep(0.7, 0.9, abs(vUv.x - 0.5) * 2.0);
          edge += smoothstep(0.7, 0.9, abs(vUv.y - 0.5) * 2.0);
          edge = clamp(edge, 0.0, 1.0);
          
          // Add pulsing glow when hovered
          float pulse = sin(time * 3.0) * 0.1 + 0.9;
          float glowIntensity = hoverState * pulse * 0.3;
          
          // Combine effects
          color = mix(color, glowColor, edge * glowIntensity);
          
          // Add active state highlight
          color += activeState * glowColor * 0.5;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    
    this.buttonMesh = new THREE.Mesh(geometry, this.buttonMaterial);
  }

  createTextMesh() {
    const textGeometry = new TextGeometry(this.options.text, {
      font: this.font,
      size: 0.2,
      height: 0.01,
      curveSegments: 12
    });
    textGeometry.center();
    
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
    this.textMesh.position.z = 0.11; // Slightly above the button surface
  }

  update(time) {
    if (this.buttonMaterial) {
      this.buttonMaterial.uniforms.time.value = time;
      this.buttonMaterial.uniforms.hoverState.value = THREE.MathUtils.lerp(
        this.buttonMaterial.uniforms.hoverState.value,
        this.isHovered ? 1 : 0,
        0.1
      );
      this.buttonMaterial.uniforms.activeState.value = THREE.MathUtils.lerp(
        this.buttonMaterial.uniforms.activeState.value,
        this.isActive ? 1 : 0,
        0.1
      );
    }
  }
}
