import { Coord } from 'utils/interfaces';
import p5Types from 'p5';
import { translate, toDegrees, rotate, scale } from 'utils/calculate';

interface SphereProps {
  center: Coord;
  radius: number;
  color: string;
  intensityM: number;
  intensityP: number;
}

export default class Sphere {
  readonly id: String;

  center: Coord;
  radius: number;

  color: string;

  extremes: Coord[][] = [[]];

  constructor(props: SphereProps) {
    this.id = this.generateID(2);
    this.center = props.center;
    this.radius = props.radius;
    this.color = props.color;

    const intM = 360 / props.intensityM;
    const intP = 180 / props.intensityP;

    for (let i = 0, index = 0; i < 180; i += intP, index++) {
      const actual: Coord[] = [];
      for (let t = 0, index2 = 0; t < 360; t += intM, index2++) {
        let x = props.radius * Math.sin(toDegrees(i)) * Math.sin(toDegrees(t));
        let y = props.radius * Math.cos(toDegrees(i));
        let z = props.radius * Math.sin(toDegrees(i)) * Math.cos(toDegrees(t));
        actual[index2] = [
          x + this.center[0],
          y + this.center[1],
          z + this.center[2],
        ];
      }
      this.extremes[index] = actual;
    }
  }

  generateID(length: number): string {
    return Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '');
  }

  drawSphere(p5: p5Types) {
    p5.stroke(this.color);
    for (let i = 0; i < this.extremes.length; i++) {
      p5.beginShape();

      for (let t = 0; t < this.extremes[i].length; t++) {
        const actual = this.extremes[i][t];
        p5.vertex(actual[0], actual[1], actual[2]);
      }
      p5.endShape(p5.CLOSE);
    }
  }

  translateSphere(tX: number, tY: number, tZ: number) {
    this.extremes = this.extremes.map((coord) => translate(coord, tX, tY, tZ));
  }

  rotateSphere(angle: number, option: 'X' | 'Y' | 'Z') {
    this.extremes = this.extremes.map((coord) => rotate(coord, angle, option));
  }

  scaleSphere(sX: number, sY: number, sZ: number) {
    this.extremes = this.extremes.map((coord) => scale(coord, sX, sY, sZ));
  }
}
