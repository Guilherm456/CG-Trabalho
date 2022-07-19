import { Coord } from 'utils/interfaces';

import { rotate } from 'utils/calculate';

export class Light {
  public position: Coord;
  public ambientLightIntensity: Coord;
  public lightIntensity: Coord;

  public rotate: boolean = false;
  public angle: number = 1;
  public direction: 'X' | 'Y' | 'Z' = 'Z';

  constructor(position: Coord, Ila: Coord, Ia: Coord) {
    this.position = position;

    this.ambientLightIntensity = Ila;
    this.lightIntensity = Ia;
  }

  setIntensity(Ila?: Coord, Ia?: Coord) {
    this.ambientLightIntensity = Ila ?? this.ambientLightIntensity;
    this.lightIntensity = Ia ?? this.lightIntensity;
  }

  setPosition(position: Coord) {
    this.position = position;
  }

  setRotate(rotate: boolean, angle?: number, direction?: 'X' | 'Y' | 'Z') {
    this.rotate = rotate;
    this.angle = angle ?? this.angle;
    this.direction = direction ?? this.direction;
  }

  rotateLight() {
    this.position = rotate(this.position, this.angle, this.direction) as Coord;
  }

  // getFaceColor(
  //   face: Coord[],
  //   observer: Coord,
  //   Ka: number[],
  //   Kd: number[],
  //   Ks: number[],
  //   Ns: number,
  //   p5: p5types
  // ) {
  //   const centroid = this.getCentroid(face);
  //   const normal = getNormal(p5, face).normalize();

  //   const [X, Y, Z] = face[0];
  //   const [X_Observer, Y_Observer, Z_Observer] = observer;
  //   const [X_Position, Y_Position, Z_Position] = this.position;
  //   const referencePoint = p5.createVector(X, Y, Z);

  //   const L = p5.createVector(...this.position).sub(referencePoint);
  //   const R = normal.copy().sub(L).mult(L).mult(2).dot(normal);
  //   const S = p5
  //     .createVector(X_Observer, Y_Observer, Z_Observer)
  //     .sub(referencePoint);

  //   const Fatt = Math.min(
  //     1 / p5.dist(X, Y, Z, X_Position, Y_Position, Z_Position)
  //   );

  //   const ItR =
  //     Ka[0] * this.ambientLightIntensity[0] +
  //     Fatt *
  //       this.lightIntensity[0] *
  //       (Kd[0] * normal.dot(L) + Ks[0] * Math.pow(normal.dot(R), Ns));
  //   const ItG =
  //     Ka[1] * this.ambientLightIntensity[1] +
  //     Fatt *
  //       this.lightIntensity[1] *
  //       (Kd[1] * normal.dot(L) + Ks[1] * Math.pow(normal.dot(R), Ns));
  //   const ItB =
  //     Ka[2] * this.ambientLightIntensity[2] +
  //     Fatt *
  //       this.lightIntensity[2] *
  //       (Kd[2] * normal.dot(L) + Ks[2] * Math.pow(normal.dot(R), Ns));
  //   return [ItR, ItG, ItB];
  // }

  // getCentroid(face: Coord[]) {
  //   const x = [
  //     Math.min(...face.map(([x]) => x)),
  //     Math.max(...face.map(([x]) => x)),
  //   ];
  //   const y = [
  //     Math.min(...face.map(([, y]) => y)),
  //     Math.max(...face.map(([, y]) => y)),
  //   ];
  //   const z = [
  //     Math.min(...face.map(([, , z]) => z)),
  //     Math.max(...face.map(([, , z]) => z)),
  //   ];

  //   return [(x[1] - x[0]) / 2, (y[1] - y[0]) / 2, (z[1] - z[0]) / 2];
  // }
}
