import {SphereGeometry, MeshLambertMaterial, Mesh} from 'three';

// set private for low dependency with scene. mesh has many properties.
// if it is public, it may have an opportunity to be misused on dependent class.
let _mesh = null;

export default class Particle {
    constructor(radius, position = {x, y, z}, velocity = {x, y, z}, options) {
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

        return this;
    }
    setPosition({x, y, z}){
        _mesh.position.set(x, y, z);
    }
    getPosition() {
        return _mesh.position;
    }
    appendedTo(scene) {
        scene.add(_mesh);
    }
}