import { Group, Vector3 } from '../../libs/three137/three.module.js';
import { GLTFLoader } from '../../libs/three137/GLTFLoader.js';

class Obstacles{
    constructor(game) {
        this.assetsPath = game.assetsPath;
		this.game = game;
		this.scene = game.scene;
        this.loadStar();
		this.loadBomb();
		// Vector of X, Y, Z
		this.tmpPos = new Vector3();
    }

    loadStar() {
    	const loader = new GLTFLoader().setPath(`${this.assetsPath}plane/`);
        this.ready = false;
        
		loader.load(
			'star.glb',
			// Resource is loaded
			gltf => {
                this.star = gltf.scene.children[0];
				//this.star.scale.set(0.25, 0.25, 0.25);

                this.star.name = 'star';
				if (this.bomb !== undefined) {
					this.initialize();
				}
			},
			err => {
				console.error( err );
			}
		);
	}	

    loadBomb() {
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}plane/`);
        
		loader.load(
			'nuclear_bomb.glb',
			// Resource is loaded
			gltf => {
                this.bomb = gltf.scene.children[0];
				this.bomb.scale.set(0.1, 0.1, 0.1);
				this.bomb.name = 'bomb';
                if (this.star !== undefined) {
					this.initialize();
				}
			},
			err => {
				console.error( err );
			}
		);
	}

	// Create objects (stars and bombs)
	initialize() {
		// Array that will contain group of objects
        this.obstacles = [];

		// Group of objects
		var obstacle = new Group();

		// Creates group of 5 objects, 'y' var serves as position
        for(let y = 10; y >= -10; y -= 5){
			// For new x position value
			let x = Math.floor(Math.random() * 10 + 10);
            const star = this.star.clone();
			const bomb = this.bomb.clone();

			if(y % 2 == 0) {
				bomb.position.y = y;
				bomb.position.x = x;
				obstacle.add(bomb);
			} else {
				star.position.y = y;
				star.position.x = x;
				obstacle.add(star);
			}
        }
        this.obstacles.push(obstacle);
        this.scene.add(obstacle);

		// Create 3 more groups of objects
        for(let i = 0; i < 3; i++){

			obstacle = new Group();

			for(let y = 10; y >= -10; y -= 5){
				let x = Math.floor(Math.random() * 10 + 10);
				const star = this.star.clone();
				const bomb = this.bomb.clone();
	
				if(y % 2 != 0) {
					bomb.position.y = y;
					bomb.position.x = x;
					obstacle.add(bomb);
				} else {
					star.position.y = y;
					star.position.x = x;
					obstacle.add(star);
				}
			}

			this.obstacles.push(obstacle);
			this.scene.add(obstacle);
        }

		this.reset();
		this.ready = true;
    }

    reset() {
		// Pos is 'z' value to position next group of objects, offset is for y axis
        this.obstacleSpawn = { pos: 15, offset: 5};

		this.obstacles.forEach(obstacle => this.respawnObstacle(obstacle));
    }

    respawnObstacle(obstacle) {
		// Distance between object's groups
        this.obstacleSpawn.pos += 20;

		const offset = (Math.random() * 2 - 1) * this.obstacleSpawn.offset;
		this.obstacleSpawn.offset += 0.2;

		obstacle.position.set(0, offset, this.obstacleSpawn.pos);
		obstacle.userData.hit = false;

		obstacle.children.forEach(child => {
			child.visible = true;
		});
    }

	update(pos) {
        let collision;

		// For each group of objects
		this.obstacles.forEach(obstacle => {
			const posZ = obstacle.position.z - pos.z; // pos.z = plane's position
			
			if (Math.abs(posZ) < 2 && !obstacle.userData.hit) {
				collision = obstacle;
			}

			// If object group is behind player, respawn it
			if (posZ < -25) {
				this.respawnObstacle(obstacle);
			}
		});

		// If collision was defined check every object in group for possible collision
		if (collision !== undefined) {
			const planePosition = this.game.plane.position;

			// Checks for every object
			collision.children.some(child => {
				child.getWorldPosition(this.tmpPos);
				const dist = this.tmpPos.distanceToSquared(planePosition);

				if (dist < 5) {
					collision.userData.hit = true;
					this.hit(child);
					return true;
				}
			});
		}
    }

	hit(obj) {
		if (obj.name == 'star') {
			this.game.addScore();
		} else {
			this.game.reduceLives();
		}
		obj.visible = false;
	}
}

export { Obstacles };