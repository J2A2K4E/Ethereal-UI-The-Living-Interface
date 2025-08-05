import * as THREE from 'three';
import { App } from './App';

class Main {
  constructor() {
    this.init();
  }

  init() {
    this.app = new App();
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.app.update();
  }
}

new Main();
