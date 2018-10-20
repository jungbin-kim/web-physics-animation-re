import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, Vector3, ArrowHelper } from 'three';
import OrbitControls from 'three-orbitcontrols';

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
}