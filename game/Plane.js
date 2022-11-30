import { Vector3 } from '../../libs/three137/three.module.js';
import { GLTFLoader } from '../../libs/three137/GLTFLoader.js';

class Plane{
    constructor(game) {
        this.assetsPath = game.assetsPath;
        this.game = game;
        this.scene = game.scene;
        this.load();
        // Vector of X, Y, Z
        this.tmpPos = new Vector3();
    }

    get position() {
        if (this.plane !== undefined) {
            this.plane.getWorldPosition(this.tmpPos);
        }
        return this.tmpPos;
    }

    load() {
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}plane/`);
        this.ready = false;
        
		loader.load(
			'microplane.glb',
			// Resource is loaded
			gltf => {
                this.scene.add(gltf.scene);
                this.plane = gltf.scene;
                this.velocity = new Vector3(0, 0, 0.1);

                this.ready = true;
			},
			err => {
				console.error( err );
			}
		);
	}	

    update(time) {

        // Game is ready to start
        if (this.game.active){

            // Move player
            if (this.game.left) {
                this.plane.position.x += 0.2;
            } else if (this.game.right) {
                this.plane.position.x -= 0.2;
            } else if (this.game.up) {
                this.plane.position.y += 0.1;
            } else if (this.game.down) {
                this.plane.position.y -= 0.1;
            }

            // Velocity keeps incrementing
            this.velocity.z += 0.0001;

            // Plane rocks side to side
            this.plane.rotation.set(0, 0, Math.sin(time * 3) * 0.2, 'XYZ');

            // Plane keeps moving forward
            this.plane.translateZ(this.velocity.z);

        }else{
            // Plane moves up and down and rocks side to side
            this.plane.rotation.set(0, 0, Math.sin(time * 3) * 0.2, 'XYZ');
            this.plane.position.y = Math.cos(time) * 1.5;
        }

    }

    // Reset velocity and position to re-start
    reset() {
        this.plane.position.set(0, 0, 0);
        this.velocity.set(0, 0, 0.3);
    }
}

export { Plane };