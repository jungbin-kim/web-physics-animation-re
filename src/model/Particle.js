import {SphereGeometry, MeshLambertMaterial, Mesh, Vector3} from 'three';

// set private for low dependency with scene. mesh has many properties.
// if it is public, it may have an opportunity to be misused on dependent class.
let _mesh = null;

export default class Particle {
    constructor(radius, position = {x, y, z}, velocity = {x, y, z}, mass, options) {
        const defaultOptions = {
            color: 0x006666
        };
        const mergedOptions = Object.assign(defaultOptions, options);

        let sphereGeometry = new SphereGeometry(radius, 20, 20); //radius, widthSegments, heightSegments
        let sphereMaterial = new MeshLambertMaterial({ color: mergedOptions.color });
        _mesh = new Mesh(sphereGeometry, sphereMaterial);

        // Set position & velocity
        this.setPosition(position);
        this.velocity = velocity;
        this.mass = mass;

        return this;
    }
    setPosition({x, y, z}){
        _mesh.position.set(x, y, z);
    }
    getPosition() {
        return _mesh.position;
    }
    nextPosition(dt) {
        const movedPosition = new Vector3().addScaledVector(this.velocity, dt);
        return new Vector3().addVectors(this.getPosition(), movedPosition);
    }
    nextVelocity(dt, acceleration) {
        const movedVelocity = new Vector3().addScaledVector(acceleration, dt);
        return new Vector3().addVectors(this.velocity, movedVelocity);
    }
    appendedTo(scene) {
        scene.add(_mesh);
    }
}