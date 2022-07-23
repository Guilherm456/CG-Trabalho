import { vec3, vec4 } from 'utils/interfaces';
import p5Types from 'p5';
import {
  translate,
  toDegrees,
  rotate,
  scale,
  matrixMul,
} from 'utils/calculate';

import * as numJS from 'numjs';
import { Camera } from 'components/Camera';
import { getNormal } from 'utils/others';
import { Light } from 'components/Light';

interface SphereProps {
  center: vec3;
  radius: number;
  intensityM: number;
  intensityP: number;
  name: string;
  Ka: vec3;
  Kd: vec3;
  Ks: vec3;
  Ns: number;
}

export default class Sphere {
  //ID do objeto
  readonly id: String;

  //O centro da esfera
  center: vec3;

  //Raio
  radius: number;

  Ka: vec3; //Fator de Reflexão Ambiente
  Kd: vec3; //Fator de Reflexão Difusa
  Ks: vec3; //Fator de Reflexão Especular
  n: number = 1; //Shininess ("brilho")

  //Os vertices da esfera
  vertice: vec3[][] = [];

  //Os pontos que serão utilizados para desenhar as faces (não muda, apenas se mudar o número de paralelos ou meridianos)
  facesPoints: number[][][] = [];

  //Os valores das faces (para economizar cálculos a cada frame)
  faces: vec3[][] = [];

  //Nome da esfera
  name: string;

  //Número de meridianos
  intensityM: number;

  //Número de paralelos
  intensityP: number;

  //Instancia a esfera
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

    //Verifica o "angulo" para cada paralelo e cada meridiano
    const intM = 360 / props.intensityM;
    const intP = 180 / (props.intensityP + 1);

    //Cria os vértices zerados
    this.vertice = numJS
      .zeros([props.intensityP + 2, props.intensityM, 3])
      .tolist();

    //Obtem os pontos extremos da esfera (alto e baixo)
    const extremesPoint = this.getExtremePoints();

    //Cria os pontos de cada paralelo
    for (
      let i = 0, index = this.intensityP;
      i < this.intensityP;
      i++, index--
    ) {
      //Para cada paralelo, cria os pontos de cada meridiano
      for (let t = 0; t < props.intensityM; t++) {
        //Calcula o angulo do meridiano e paralelo atual
        const angleP = toDegrees((i + 1) * intP);
        const angleM = toDegrees((t + 1) * intM);

        //Calcula o X,Y,Z do ponto atual
        //Seria equivalente a fazer uma rotação de matriz
        let x = props.radius * Math.sin(angleP) * Math.sin(angleM);
        let y = props.radius * Math.cos(angleP);
        let z = props.radius * Math.sin(angleP) * Math.cos(angleM);

        //Adiciona o ponto ao array de vértices (de forma contrária)
        this.vertice[index][t] = [
          x + this.center[0],
          y + this.center[1],
          z + this.center[2],
        ];
      }
    }

    //Adiciona os pontos extremos à esfera
    for (let t = 0; t < props.intensityM; t++) {
      this.vertice[0][t] = extremesPoint[1] as vec3;
      this.vertice[this.intensityP + 1][t] = extremesPoint[0] as vec3;
    }

    //Os pontos das faces não irão mudar de posição, então eles são definidos apenas uma vez
    this.facesPoints = this.defineFacesPoints();

    //As faces são definidas a cada alteração para que elas sejam desenhadas de forma correta e economizando cálculos
    this.faces = this.defineFace() as vec3[][];
  }

  //Gera um ID aleatório
  private generateID(length: number): string {
    return Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '');
  }

  //Define os pontos que serão utilizados para desenhar as faces
  defineFacesPoints() {
    const faces: number[][][] = [];

    //Para cada paralelo
    for (let i = 0; i < this.vertice.length - 1; i++) {
      //Para cada meridiano
      for (let j = 0; j < this.vertice[i].length; j++) {
        //Se for os pontos extremos, será desenhado o triângulo da face
        if (i === 0)
          faces.push([
            [i, j],
            [i + 1, j],
            [i + 1, (j + 1) % this.intensityM],
          ]);
        else if (i === this.vertice.length - 2)
          faces.push([
            [i, j],
            [i + 1, j],
            [i, (j + 1) % this.intensityM],
          ]);
        //Se não for os pontos extremos, será desenhado o quadrado da face
        else {
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

    // for (let i = 0; i < 2; i++) {
    //   const actualIndex = i * this.intensityP - 2;
    //   const facesActual: number[][] = [];
    //   for (let j = 0; j < this.intensityM; j++) {
    //     faces.push([
    //       [actualIndex, j],
    //       [actualIndex + 1, j],
    //       [actualIndex + 1, (j + 1) % this.intensityM],
    //     ]);
    //   }
    //   if (actualIndex === 0) faces.unshift(facesActual);
    //   else faces.push(facesActual);
    // }
    return faces;
  }

  //Define as faces
  defineFace() {
    const faces: number[][][] = [];
    for (let lineFaces of this.facesPoints) {
      const faceP = [];
      for (let face of lineFaces) {
        //Pega os pontos da face nos vértices
        faceP.push([
          this.vertice[face[0]][face[1]][0],
          this.vertice[face[0]][face[1]][1],
          this.vertice[face[0]][face[1]][2],
          1,
        ]);
      }
      faces.push(faceP);
    }
    return faces;
  }

  //Desenha a esfera (apenas as linhas)
  drawSphere(p5: p5Types) {
    p5.push();
    p5.stroke(this.Ka[0], this.Ka[1], this.Ka[2]);
    const extremesSphere = this.getExtremePoints();

    //Desenha as linhas extremas da esfera
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
    //Verifica a distância do objeto com a câmera
    const distance = p5
      .createVector(...camera.N)
      .dot(p5.createVector(...camera.VRP).sub(p5.createVector(...this.center)));

    if (distance < camera.near || distance > camera.far) return;

    //Repassa os dados para o shader
    shader.setUniform('uKa', [...this.Ka]);
    shader.setUniform('uKd', [...this.Kd]);
    shader.setUniform('uKs', [...this.Ks]);
    shader.setUniform('uObserver', [...camera.VRP]);
    shader.setUniform('uLightPosition', [...light.position]);
    shader.setUniform('uN', this.n);
    shader.setUniform('uIla', [...light.ambientLightIntensity]);
    shader.setUniform('uIl', [...light.lightIntensity]);
    shader.setUniform('uLightType', light.lightType);
    for (let i = 0; i < this.faces.length; i++) {
      //Vai normalizar a face
      const facesNormal = getNormal(p5, this.faces[i]);
      const dot = Nvector.dot(facesNormal);

      //Caso a face esteja na frente da camera, ela será desenhada
      if (dot < 0.00000001) continue;

      shader.setUniform('uReferencePoint', [...facesNormal.array()]);
      shader.setUniform('uFaceNormal', [...facesNormal.array()]);
      p5.beginShape();
      for (let j = 0; j < this.faces[i].length; j++) {
        const actualFace = this.faces[i][j];

        //Transforma os pontos da face para o sistema de coordenadas da camera
        const face = matrixMul(actualFace, camera.concatedMatrix) as vec4;

        p5.vertex(face[0], face[1], actualFace[2]);
      }

      p5.endShape(p5.CLOSE);
    }
    p5.pop();
  }

  //Retorna os pontos extremos da esfera
  getExtremePoints() {
    const [x, y, z] = this.center;
    return [
      [x, y + this.radius, z],
      [x, y - this.radius, z],
    ];
  }

  //Translada a esfera
  translateSphere(tX: number, tY: number, tZ: number) {
    //Move o centro
    this.center = translate(this.center, tX, tY, tZ) as vec3;
    //Move os vértices
    this.vertice = this.vertice.map((vec3) =>
      translate(vec3, tX, tY, tZ)
    ) as vec3[][];
    //Recalcula as faces
    this.faces = this.defineFace() as vec3[][];
  }

  //Rotaciona a esfera
  rotateSphere(angle: number, option: 'X' | 'Y' | 'Z') {
    //Rotaciona o centro
    this.center = rotate(this.center, angle, option) as vec3;
    //Rotaciona os vértices
    this.vertice = this.vertice.map((vec3) =>
      rotate(vec3, angle, option)
    ) as vec3[][];
    //Recalcula as faces
    this.faces = this.defineFace() as vec3[][];
  }

  //Escala a esfera
  scaleSphere(sX: number, sY: number, sZ: number) {
    //Escala o centro
    this.center = scale(this.center, sX, sY, sZ) as vec3;
    //Escala os vértices
    this.vertice = this.vertice.map((vec3) =>
      scale(vec3, sX, sY, sZ)
    ) as vec3[][];
    //Recalcula as faces
    this.faces = this.defineFace() as vec3[][];
  }
}
