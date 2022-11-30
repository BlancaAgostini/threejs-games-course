import * as THREE from '../../libs/three137/three.module.js';
import { RGBELoader } from '../../libs/three137/RGBELoader.js';
import { Plane } from './Plane.js';
import { Obstacles } from './Obstacles.js';

class Game{
	constructor() {
		const container = document.createElement('div');
		document.body.appendChild(container);

        this.clock = new THREE.Clock();

		this.assetsPath = '../../assets/';
        
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.set(-4.37, 0, -4.75);
        this.camera.lookAt(0, 0, 6);

        this.cameraController = new THREE.Object3D();
        this.cameraController.add(this.camera);
        this.cameraTarget = new THREE.Vector3(0,0,6);
        
		this.scene = new THREE.Scene();
        this.scene.add(this.cameraController);

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        this.scene.add(ambient);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild(this.renderer.domElement);
        
        this.load(); 
	
		window.addEventListener('resize', this.resize.bind(this) );

        // Game is not ready to start, prob not loaded
        this.active = false;

        // Left - Letter A
        document.addEventListener('keydown', this.keyLeft.bind(this));
        document.addEventListener('keyup', this.keyLeftNo.bind(this));

        // Right - Letter D
        document.addEventListener('keydown', this.keyRight.bind(this));
        document.addEventListener('keyup', this.keyRightNo.bind(this));

        // Up - Letter W
        document.addEventListener('keydown', this.keyUp.bind(this));
        document.addEventListener('keyup', this.keyUpNo.bind(this));

        // Down - Letter S
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyDownNo.bind(this));

        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;

        const btn = document.getElementById('playBtn');
        btn.addEventListener('click', this.startGame.bind(this));
	}

    startGame() {

        // Hide Play button and GameOver sign
        const btn = document.getElementById('playBtn');
        const gameover = document.getElementById('gameover');
        const instructions = document.getElementById('instructions');

        btn.style.display = 'none';
        gameover.style.display = 'none';
        instructions.style.display = 'none';

        // Set variables
        this.score = 0;
        this.lives = 3;

        let ele = document.getElementById('score');
        ele.innerHTML = this.score;

        ele = document.getElementById('lives');
        ele.innerHTML = this.lives;

        // Set obstacles and plane to start position
        this.plane.reset();
        this.obstacles.reset();

        // Game is ready to start
        this.active = true;
    }
    
    // Letter A
    keyLeft(e) {
        if (e.keyCode == 65) {
            console.log('left');
            this.left = true;
        }
    }
    keyLeftNo(e) {
        if (e.keyCode == 65) {
            this.left = false;
        }
    }

    // Letter D
    keyRight(e) {
        if (e.keyCode == 68) {
            this.right = true;
        }
    }
    keyRightNo(e) {
        if (e.keyCode == 68) {
            this.right = false;
        }
    }

    // Letter W
    keyUp(e) {
        if (e.keyCode == 87) {
            this.up = true;
        }
    }
    keyUpNo(e) {
        if (e.keyCode == 87) {
            this.up = false;
        }
    }

    // Letter S
    keyDown(e) {
        if (e.keyCode == 83) {
            this.down = true;
        }
    }
    keyDownNo(e) {
        if (e.keyCode == 83) {
            this.down = false;
        }
    }
	
    // Resizes images according to screen size
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }
    
	load() {
        this.loading = true;

        this.loadSkybox();
        this.plane = new Plane(this);
        this.obstacles = new Obstacles(this);
    }

    loadSkybox() {
        this.scene.background = new THREE.CubeTextureLoader()
        .setPath(`${this.assetsPath}plane/paintedsky/`)
        .load( [
            'px.jpg',
            'nx.jpg',
            'py.jpg',
            'ny.jpg',
            'pz.jpg',
            'nz.jpg'
        ], () => {
            this.renderer.setAnimationLoop(this.render.bind(this));
        });
    }		

    updateCamera() {
        this.cameraController.position.copy(this.plane.position);
        this.cameraController.position.y = 0;

        this.cameraTarget.copy(this.plane.position);
        this.cameraTarget.z += 6;
        this.camera.lookAt(this.cameraTarget);
    }

	render() {
        if (this.loading) {
            if (this.plane.ready && this.obstacles.ready) {
                this.loading = false;
            } else {
                return;
            }
        }

        const time = this.clock.getElapsedTime();

        if (this.active) {
            this.obstacles.update(this.plane.position);
        }

        this.plane.update(time);
        this.updateCamera();

        this.renderer.render(this.scene, this.camera);
    }

    gameover() {
        this.active = false;

        const gameover = document.getElementById('gameover');
        const btn = document.getElementById('playBtn');
        const instructions = document.getElementById('instructions');

        gameover.style.display = 'block';
        btn.style.display = 'block';
        instructions.style.display = 'block';
    }

    addScore() {
        this.score += 1;

        const score = document.getElementById('score');
        score.innerHTML = this.score;
    }

    reduceLives() {
        this.lives -= 1;

        const lives = document.getElementById('lives');
        lives.innerHTML = this.lives;

        if (this.lives == 0) {
            this.gameover();
        }
    }
}

export { Game };