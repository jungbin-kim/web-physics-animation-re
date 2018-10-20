import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, Vector3, ArrowHelper } from 'three';
import OrbitControls from 'three-orbitcontrols';
import Particle from "./model/Particle";

export default class App {
    constructor(rendererWrap) {
        const width = rendererWrap.offsetWidth;
        const height = rendererWrap.offsetHeight;
        // init renderer
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(width, height);
        rendererWrap.appendChild(this.renderer.domElement);
        // scene
        this.scene = new Scene();
        // camera
        const angle = 45, aspect = width/height, near = 0.1, far = 20000;
        this.camera = this.makeCamera(angle, aspect, near, far, {x:1, y:0, z:7});
        this.scene.add(this.camera);
        // light
        const light = new DirectionalLight();
        light.position.set(-10, 0, 20);
        this.scene.add(light);
        // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.appendAixs(this.scene);

        // Particle set initial random position & velocity on scene
        const initParticlePosition = this.setRandomVector3(-0.2, 0.2, -0.2, 0.2, 2.0, 3.0);
        const initParticleVelocity = this.setRandomVector3(-0.1, 0.1, -0.1, 0.1, -0.1, 0.1);
        const p = new Particle(0.1, initParticlePosition, initParticleVelocity);
        p.appendedTo(this.scene);

        // Render on scene
        this.renderer.render(this.scene, this.camera);
    }
    makeCamera(angle, aspect, near, far, position) {
        const camera = new PerspectiveCamera(angle, aspect, near, far);
        camera.position.set(position.x, position.y, position.z);
        return camera;
    }
    appendAixs(scene){
        const origin = new Vector3(0, 0, 0);
        const xAixs = new Vector3(1, 0, 0);
        const arrowX = new ArrowHelper(xAixs, origin, 1, 0xff0000);//Red
        scene.add(arrowX);
        const yAixs = new Vector3(0, 1, 0);
        const arrowY = new ArrowHelper(yAixs, origin, 1, 0xffff00);//Yellow
        scene.add(arrowY);
        const zAixs = new Vector3(0, 0, 1);
        const arrowZ = new ArrowHelper(zAixs, origin, 1, 0xffffff);//white
        scene.add(arrowZ);
    }
    setRandomVector3(minX,maxX,minY,maxY,minZ,maxZ){
        const x = this.getRandomFloat(minX,maxX),
            y = this.getRandomFloat(minY,maxY),
            z = this.getRandomFloat(minZ,maxZ);
        return new Vector3(x,y,z);
    }
    getRandomFloat(min, max){
        const random = Math.random() * (max - min) + min;
        return parseFloat(random.toFixed(1));
    }
}