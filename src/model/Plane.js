import {Mesh, MeshNormalMaterial, PlaneGeometry, Vector3} from "three";

let _mesh = null;

export default class Plane {
    constructor(p1={x, y, z}, p2={x, y, z}, p3={x, y, z}) { // make plane using 3 points
        this.p = p1; // A point on Plane
        this.u = new Vector3().subVectors(p2, p1);
        this.v = new Vector3().subVectors(p3, p1);
        this.uCrossV = new Vector3().crossVectors(this.u, this.v);
        this.normal = this.uCrossV.clone().normalize();

        const planeGeometry = new PlaneGeometry();
        planeGeometry.vertices[0]=this.equation(0,0, p1, this.u, this.v);
        planeGeometry.vertices[1]=this.equation(0,1, p1, this.u, this.v);
        planeGeometry.vertices[2]=this.equation(1,0, p1, this.u, this.v);
        planeGeometry.vertices[3]=this.equation(1,1, p1, this.u, this.v);
        _mesh = new Mesh(planeGeometry, new MeshNormalMaterial());
    }
    // Plane equation: x(s,t) = p + s(q-p) + t(r-p)
    // where p, q, r are points on the plane and the plane is bound to s,t [0,1]
    equation(s, t, p1, u, v) {
        const su = new Vector3().addScaledVector(u, s); // s(q-p)
        const tv = new Vector3().addScaledVector(v, t); // t(r-p)
        return new Vector3().addVectors(p1, su).add(tv);
    }
    appendedTo(scene) {
        scene.add(_mesh);
    }
}
