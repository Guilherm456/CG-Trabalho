import { Coord } from 'utils/interfaces';
import p5Types from 'p5';

import * as numJS from 'numjs';

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

  private intensityM: number;
  private intensityP: number;

  extremes: [Coord[]];

  constructor(props: SphereProps) {
    this.id = this.generateID(2);
    this.center = props.center;
    this.radius = props.radius;
    this.color = props.color;
    this.intensityM = props.intensityM;
    this.intensityP = props.intensityP;

    const intM = 360 / props.intensityM;
    const intP = 180 / props.intensityP;

    this.extremes = numJS
      .zeros(props.intensityM * props.intensityP * 3)
      .reshape(props.intensityP, props.intensityM, 3)
      .tolist() as [Coord[]];

    for (let i = 0; i < props.intensityP; i++) {
      for (let t = 0; t < props.intensityM; t++) {
        const angleP = this.toDegrees((i + 1) * intP);
        const angleM = this.toDegrees((t + 1) * intM);

        let x = props.radius * Math.sin(angleP) * Math.sin(angleM);
        let y = props.radius * Math.cos(angleP);
        let z = props.radius * Math.sin(angleP) * Math.cos(angleM);
        this.extremes[i][t] = [
          x + this.center[0],
          y - this.center[1],
          z + this.center[2],
        ];
      }
    }
  }

  toDegrees(angle: number) {
    return angle * (Math.PI / 180);
  }

  generateID(length: number): string {
    return Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '');
  }

  drawSphere(p5: p5Types) {
    p5.stroke(this.color);

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
      p5.endShape(p5.CLOSE);
    }
  }
}
