import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, Vector3, ArrowHelper } from 'three';
import OrbitControls from 'three-orbitcontrols';
import Particle from "./model/Particle";
import Plane from "./model/Plane";

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
        this.camera = this.makeCamera(angle, aspect, near, far, {x:0, y:-7, z:2});
        this.scene.add(this.camera);
        // light
        const light = new DirectionalLight();
        light.position.set(-10, 0, 20);
        this.scene.add(light);
        // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.aixsAppendedTo(this.scene);

        // Particle set initial random position & velocity on scene
        const initParticlePosition = this.setRandomVector3(-0.2, 0.2, -0.2, 0.2, 2.0, 3.0);
        const initParticleVelocity = this.setRandomVector3(-0.1, 0.1, -0.1, 0.1, -0.1, 0.1);
        const particleMass = 1;
        this.particle = new Particle(0.1, initParticlePosition, initParticleVelocity, particleMass);
        this.particle.appendedTo(this.scene);

        // plane
        const p = this.setRandomVector3(-1.5, -1.0, -1.5, -1.0, -0.2, 0.2);
        const q = this.setRandomVector3(1.0, 1.5, -1.5, -1.0, -0.2, 0.2);
        const r = this.setRandomVector3(1.0, 1.5, 1.0, 1.5, -0.2, 0.2);
        this.plane = new Plane(p, q, r);
        this.plane.appendedTo(this.scene);

        // Render on scene
        // this.renderer.render(this.scene, this.camera);
    }
    start() {
        requestAnimationFrame(() => this.start());
        this.isCollisionOnPlane(this.particle, this.plane);
        this.renderer.render(this.scene, this.camera);
    }
    makeCamera(angle, aspect, near, far, position) {
        const camera = new PerspectiveCamera(angle, aspect, near, far);
        camera.position.set(position.x, position.y, position.z);
        return camera;
    }
    aixsAppendedTo(scene){
        const origin = new Vector3(0, 0, 0);
        const xAixs = new Vector3(1, 0, 0);
        const arrowX = new ArrowHelper(xAixs, origin, 1, 0xff0000);// Red 최초 좌우
        scene.add(arrowX);
        const yAixs = new Vector3(0, 1, 0);
        const arrowY = new ArrowHelper(yAixs, origin, 1, 0xffff00);// Yellow 최초 상하
        scene.add(arrowY);
        const zAixs = new Vector3(0, 0, 1);
        const arrowZ = new ArrowHelper(zAixs, origin, 1, 0xffffff);// White 최초 앞뒤
        scene.add(arrowZ);
    }
    isCollisionOnPlane(particle, plane){
        // b = x(tn)-p (p: point on plane)
        let particlePositionMinusP = new Vector3().subVectors(particle.getPosition(), plane.p);
        // before collision
        const particlePositionBeforeCollision = particle.getPosition(); //x(tn)
        const particleVelocityBeforeCollision = particle.velocity.clone();
        const normalVelocityBeforeCollision = plane.normal.clone().multiplyScalar(particleVelocityBeforeCollision.dot(plane.normal));
        const planeVelocityBeforeCollision = new Vector3().subVectors(particleVelocityBeforeCollision, normalVelocityBeforeCollision);

        // Euler Explicit
        const constantGravity = -10 * particle.mass; // m * g
        const dt = 0.001;
        const acc = new Vector3(0, 0, constantGravity);
        const nextParticlePosition = particle.nextPosition(dt);
        const nextParticleVelocity = particle.nextVelocity(dt, acc);

        const e = 0.8;
        const c = 1;
        const veloVec3AfterCollision = new Vector3().addVectors(
            new Vector3().addScaledVector(normalVelocityBeforeCollision, -e),
            new Vector3().addScaledVector(planeVelocityBeforeCollision, c)
        );

        // a = x(tn) - x(tn+1)
        const a = new Vector3().subVectors(particlePositionBeforeCollision, nextParticlePosition);

        const aCrossB = new Vector3().crossVectors(a, particlePositionMinusP);
        const uCrossVDotA = plane.uCrossV.dot(a);

        const s = aCrossB.dot(plane.v) / uCrossVDotA;
        const t = (-1 * aCrossB.dot(plane.u)) / uCrossVDotA;
        const lamda =  plane.uCrossV.dot(particlePositionMinusP)/ uCrossVDotA;

        const posVec3AfterCollision = new Vector3().addVectors(
            particlePositionBeforeCollision,
            new Vector3().addScaledVector(veloVec3AfterCollision, (1-lamda)*dt)
        );

        if((0 <= s && s <= 1) && (0 <= t && t <= 1) && (0 <= lamda && lamda <= 1)){
            console.log("Collision occur on the Finite Plane");
            particle.velocity = veloVec3AfterCollision;
            particle.setPosition(posVec3AfterCollision);
            return true;
        }else{
            particle.setPosition(nextParticlePosition);
            particle.velocity = nextParticleVelocity;
            return false;
        }
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