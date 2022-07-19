import { Coord } from 'utils/interfaces';
import p5Types from 'p5';
import { translate, toDegrees, rotate, scale } from 'utils/calculate';

import * as numJS from 'numjs';
import { Camera } from 'components/Camera';
import { getNormal } from 'utils/others';
import { Light } from 'components/Light';

interface SphereProps {
  center: Coord;
  radius: number;
  intensityM: number;
  intensityP: number;
  name: string;
  Ka: Coord;
  Kd: Coord;
  Ks: Coord;
  Ns: number;
}

export default class Sphere {
  readonly id: String;

  center: Coord;
  radius: number;

  Ka: Coord;
  Kd: Coord;
  Ks: Coord;
  n: number = 1;

  vertice: Coord[][] = [];
  facesPoints: number[][][] = [];
  faces: Coord[][] = [];

  name: string;

  intensityM: number;
  intensityP: number;

  constructor(props: SphereProps) {
    this.id = this.generateID(2);
    this.center = props.center;
    this.radius = props.radius;

    this.intensityM = props.intensityM;
    this.intensityP = props.intensityP;
    this.name = props.name;

    this.Ka = props.Ka;
    this.Kd = props.Kd;
    this.Ks = props.Ks;
    this.n = props.Ns;

    const intM = 360 / props.intensityM;
    const intP = 180 / (props.intensityP + 1);

    this.vertice = numJS
      .zeros([props.intensityP + 2, props.intensityM, 3])
      .tolist();
    const extremesPoint = this.getExtremePoints();

    for (
      let i = 0, index = this.intensityP;
      i < this.intensityP;
      i++, index--
    ) {
      for (let t = 0; t < props.intensityM; t++) {
        const angleP = toDegrees((i + 1) * intP);
        const angleM = toDegrees((t + 1) * intM);

        let x = props.radius * Math.sin(angleP) * Math.sin(angleM);
        let y = props.radius * Math.cos(angleP);
        let z = props.radius * Math.sin(angleP) * Math.cos(angleM);
        this.vertice[index][t] = [
          x + this.center[0],
          y + this.center[1],
          z + this.center[2],
        ];
      }
    }

    for (let t = 0; t < props.intensityM; t++) {
      this.vertice[0][t] = extremesPoint[1] as Coord;
      this.vertice[this.intensityP + 1][t] = extremesPoint[0] as Coord;
    }

    //Os pontos das faces não irão mudar de posição, então eles são definidos apenas uma vez
    this.facesPoints = this.defineFacesPoints();

    //As faces são definidas a cada alteração para que elas sejam desenhadas de forma correta e economizando cálculos
    this.faces = this.defineFace() as Coord[][];
  }

  private generateID(length: number): string {
    return Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '');
  }

  //Define os pontos que serão utilizados para desenhar as faces
  defineFacesPoints() {
    const faces: number[][][] = [];
    for (let i = 0; i < this.vertice.length - 1; i++) {
      for (let j = 0; j < this.vertice[i].length; j++) {
        if (i === 0 || i === this.vertice.length - 2) {
          faces.push([
            [i, j],
            [i + 1, j],
            [i + 1, (j + 1) % this.intensityM],
          ]);
        } else {
          const face = [
            [i, j],
            [i + 1, j],
            [i + 1, (j + 1) % this.intensityM],
            [i, (j + 1) % this.intensityM],
          ];
          faces.push(face);
        }
      }
    }

    return faces;
  }

  //Define as faces
  defineFace() {
    const faces: number[][][] = [];
    for (let lineFaces of this.facesPoints) {
      const faceP = [];
      for (let face of lineFaces) {
        faceP.push([
          this.vertice[face[0]][face[1]][0],
          this.vertice[face[0]][face[1]][1],
          this.vertice[face[0]][face[1]][2],
        ]);
      }
      faces.push(faceP);
    }
    return faces;
  }

  //Desenha a esfera (apenas as linhas)
  drawSphere(p5: p5Types) {
    p5.push();

    // p5.stroke(this.color);

    const extremesSphere = this.getExtremePoints();

    for (let i = 0; i < 2; i++) {
      const extreme =
        i === 0 ? this.vertice[0] : this.vertice[this.intensityP - 1];
      for (let j = 0; j < extreme.length; j++) {
        p5.line(
          extremesSphere[i][0],
          extremesSphere[i][1],
          extremesSphere[i][2],
          extreme[j][0],
          extreme[j][1],
          extreme[j][2]
        );
      }
    }

    for (let i = 0; i < this.vertice!.length; i++) {
      p5.beginShape();
      for (let t = 0; t < this.vertice![i].length; t++) {
        const actual = this.vertice![i][t];
        p5.vertex(actual[0], actual[1], actual[2]);
      }
      p5.endShape(p5.CLOSE);
    }

    for (let i = 0; i < this.intensityM; i++) {
      p5.beginShape();
      for (let j = 0; j < this.intensityP; j++) {
        const actual = this.vertice![j][i];
        p5.vertex(actual[0], actual[1], actual[2]);
      }
      p5.endShape();
    }
    p5.pop();
  }

  //Desenha a esfera (apenas as faces)
  drawFaces(p5: p5Types, camera: Camera, shader: p5Types.Shader, light: Light) {
    const Nvector = p5.createVector(...camera.N);

    p5.push();

    for (let i = 0; i < this.faces.length; i++) {
      //Vai normalizar a face
      const faces = getNormal(p5, this.faces[i]);
      const dot = Nvector.dot(faces);

      //Caso a face esteja na frente da camera, ela será desenhada
      if (dot < 0.0000001) continue;

      shader.setUniform('uKa', this.Ka);
      shader.setUniform('uKd', this.Kd);
      shader.setUniform('uKs', this.Ks);
      shader.setUniform('uLightPosition', light.position);
      shader.setUniform('uObserver', camera.VRP);
      shader.setUniform('uN', this.n);
      shader.setUniform('uIla', light.ambientLightIntensity);
      shader.setUniform('uIl', light.lightIntensity);
      shader.setUniform('uFaceNormal', [faces.x, faces.y, faces.z]);

      // const color = light.getFaceColor(
      //   this.faces[i],
      //   camera.VRP,
      //   this.Ka,
      //   this.Kd,
      //   this.Ks,
      //   2,
      //   p5
      // );

      p5.beginShape();
      for (let j = 0; j < this.faces[i].length; j++) {
        const face = this.faces[i][j];
        p5.vertex(face[0], face[1], face[2]);
      }
      p5.endShape(p5.CLOSE);
    }
    p5.pop();
  }

  getExtremePoints() {
    const [x, y, z] = this.center;
    return [
      [x, y + this.radius, z],
      [x, y - this.radius, z],
    ];
  }

  translateSphere(tX: number, tY: number, tZ: number) {
    this.center = translate(this.center, tX, tY, tZ) as Coord;
    this.vertice = this.vertice.map((coord) =>
      translate(coord, tX, tY, tZ)
    ) as Coord[][];
  }

  rotateSphere(angle: number, option: 'X' | 'Y' | 'Z') {
    this.center = rotate(this.center, angle, option) as Coord;
    this.vertice = this.vertice.map((coord) =>
      rotate(coord, angle, option)
    ) as Coord[][];
  }

  scaleSphere(sX: number, sY: number, sZ: number) {
    this.center = scale(this.center, sX, sY, sZ) as Coord;
    this.vertice = this.vertice.map((coord) =>
      scale(coord, sX, sY, sZ)
    ) as Coord[][];
  }
}
