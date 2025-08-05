import * as THREE from 'three';

export class InteractionSystem {
  constructor(scene, camera, domElement) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.currentIntersection = null;
    
    this.initEventListeners();
  }

  initEventListeners() {
    this.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.domElement.addEventListener('click', (event) => this.onClick(event));
    window.addEventListener('resize', () => this.onWindowResize());
  }

  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with interactive objects
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
    if (intersects.length > 0) {
      // Find the first interactive object (with userData.isInteractive)
      const interactiveObj = intersects.find(obj => obj.object.userData.isInteractive);
      
      if (interactiveObj) {
        this.handleHover(interactiveObj.object);
      } else if (this.currentIntersection) {
        this.handleHoverEnd();
      }
    } else if (this.currentIntersection) {
      this.handleHoverEnd();
    }
  }

  onClick(event) {
    if (this.currentIntersection) {
      const interactiveObj = this.findInteractiveParent(this.currentIntersection);
      if (interactiveObj && interactiveObj.userData.onClick) {
        interactiveObj.userData.onClick();
        
        // Visual feedback for click
        interactiveObj.userData.isActive = true;
        setTimeout(() => {
          if (interactiveObj.userData) {
            interactiveObj.userData.isActive = false;
          }
        }, 200);
      }
    }
  }

  handleHover(object) {
    const interactiveObj = this.findInteractiveParent(object);
    
    if (interactiveObj && interactiveObj !== this.currentIntersection) {
      // End previous hover
      if (this.currentIntersection) {
        this.handleHoverEnd();
      }
      
      // Start new hover
      this.currentIntersection = interactiveObj;
      interactiveObj.userData.isHovered = true;
      
      // Visual feedback could be added here
      if (interactiveObj.userData.onHoverStart) {
        interactiveObj.userData.onHoverStart();
      }
    }
  }

  handleHoverEnd() {
    if (this.currentIntersection) {
      this.currentIntersection.userData.isHovered = false;
      
      if (this.currentIntersection.userData.onHoverEnd) {
        this.currentIntersection.userData.onHoverEnd();
      }
      
      this.currentIntersection = null;
    }
  }

  findInteractiveParent(object) {
    let current = object;
    while (current) {
      if (current.userData.isInteractive) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  onWindowResize() {
    // Update camera aspect ratio if needed
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update() {
    // Update any ongoing interactions
    // Could add additional effects like light following cursor
  }
}
