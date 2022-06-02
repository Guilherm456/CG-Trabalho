import { Coord } from 'utils/interfaces';
import p5Types from 'p5';
import { translate, toDegrees, rotate, scale } from 'utils/calculate';

import * as numJS from 'numjs';

interface SphereProps {
  center: Coord;
  radius: number;
  color: string;
  intensityM: number;
  intensityP: number;
  name: string;
}

export default class Sphere {
  readonly id: String;

  center: Coord;
  radius: number;

  color: string;

  extremes: Coord[][] = [[]];
  name: string;

  intensityM: number;
  intensityP: number;

  constructor(props: SphereProps) {
    this.id = this.generateID(2);
    this.center = props.center;
    this.radius = props.radius;
    this.color = props.color;
    this.intensityM = props.intensityM;
    this.intensityP = props.intensityP;
    this.name = props.name;

    const intM = 360 / props.intensityM;
    const intP = 180 / (props.intensityP + 1);

    this.extremes = numJS
      .zeros(props.intensityM * props.intensityP * 3)
      .reshape(props.intensityP, props.intensityM, 3)
      .tolist() as [Coord[]];

    for (let i = 0; i < props.intensityP; i++) {
      for (let t = 0; t < props.intensityM; t++) {
        const angleP = toDegrees((i + 1) * intP);
        const angleM = toDegrees((t + 1) * intM);

        let x = props.radius * Math.sin(angleP) * Math.sin(angleM);
        let y = props.radius * Math.cos(angleP);
        let z = props.radius * Math.sin(angleP) * Math.cos(angleM);
        this.extremes[i][t] = [
          x + this.center[0],
          y + this.center[1],
          z + this.center[2],
        ];
      }
    }
  }

  private generateID(length: number): string {
    return Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '');
  }

  drawSphere(p5: p5Types) {
    p5.push();

    p5.stroke(this.color);

    const [x, y, z] = this.center;
    const extremesSphere = [
      [x, y + this.radius, z],
      [x, y - this.radius, z],
    ];

    for (let i = 0; i < 2; i++) {
      const extreme =
        i === 0 ? this.extremes[0] : this.extremes[this.intensityP - 1];
      for (let j = 0; j < extreme.length; j++) {
        p5.line(
          extremesSphere[i][0],
          extremesSphere[i][1],
          extremesSphere[i][2],
          extreme[j][0],
          extreme[j][1],
          extreme[j][2]
        );
        // p5.vertex(extreme[j][0], extreme[j][1], extreme[j][2]);
        // p5.vertex(
        //   extremesSphere[i][0],
        //   extremesSphere[i][1],
        //   extremesSphere[i][2]
        // );
      }
    }

    for (let i = 0; i < this.extremes!.length; i++) {
      p5.beginShape();
      for (let t = 0; t < this.extremes![i].length; t++) {
        const actual = this.extremes![i][t];
        p5.vertex(actual[0], actual[1], actual[2]);
      }
      p5.endShape(p5.CLOSE);
    }

    for (let i = 0; i < this.intensityM; i++) {
      p5.beginShape();
      for (let j = 0; j < this.intensityP; j++) {
        const actual = this.extremes![j][i];
        p5.vertex(actual[0], actual[1], actual[2]);
      }
      p5.endShape();
    }
    p5.pop();
  }

  translateSphere(tX: number, tY: number, tZ: number) {
    this.center = translate(this.center, tX, tY, tZ) as Coord;
    this.extremes = this.extremes.map((coord) =>
      translate(coord, tX, tY, tZ)
    ) as Coord[][];
  }

  rotateSphere(angle: number, option: 'X' | 'Y' | 'Z') {
    this.center = rotate(this.center, angle, option) as Coord;
    this.extremes = this.extremes.map((coord) =>
      rotate(coord, angle, option)
    ) as Coord[][];
  }

  scaleSphere(sX: number, sY: number, sZ: number) {
    this.center = scale(this.center, sX, sY, sZ) as Coord;
    this.extremes = this.extremes.map((coord) =>
      scale(coord, sX, sY, sZ)
    ) as Coord[][];
  }
}
