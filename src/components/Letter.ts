import p5Types from 'p5';
import { matrixMul, rotate, scale, translate } from 'utils/calculate';
import Letters from 'utils/font';
import { TypeLetter, vec3 } from 'utils/interfaces';
import { amplifierEdges, getCentroidFaces, getNormal } from 'utils/others';
import { Camera } from './Camera';
import { Light } from './Light';

export class Letter {
  public faces: vec3[][] = [];

  private facesNormal: vec3[] = [];

  private facesCentroid: vec3[] = [];

  edges: [[vec3]] = [[[-1, -1, -1]]];

  private center: vec3 = [0, 0, 0];

  private ZDepth: number = 0;

  readonly id: string;

  readonly typeLetter: TypeLetter = 'A';

  Ka: vec3; //Fator de Reflexão Ambiente
  Kd: vec3; //Fator de Reflexão Difusa
  Ks: vec3; //Fator de Reflexão Especular
  n: number; //Shininess ("brilho")

  constructor(
    center: vec3,
    ZDepth: number,
    typeLetter: TypeLetter,
    Ka: vec3 = [0.1, 0.5, 0.1],
    Kd: vec3 = [0.1, 0.5, 0.1],
    Ks: vec3 = [0.1, 0.1, 0.1],
    n: number = 1,
    faces?: vec3[][]
  ) {
    this.center = center;
    this.ZDepth = ZDepth;

    this.typeLetter = typeLetter;

    this.id = Math.ceil(Math.random() * Date.now())
      .toPrecision(3)
      .toString()
      .replace('.', '');

    if (faces) {
      this.faces = faces;
      this.calculateFacesNormal();
      this.findFacesCentroid();
    } else this.findFaces();

    this.Ka = Ka;
    this.Kd = Kd;
    this.Ks = Ks;

    this.n = n;
  }

  private findFaces() {
    const Z = this.ZDepth / 2;
    const displacement = this.center;

    const edges = Letters[this.typeLetter] as vec3[][];

    const facesZ: vec3[] = [];
    const facesConnections: vec3[][] = [];
    const facesZDepth: vec3[] = [];
    for (let i = 0; i < edges.length; i++) {
      // Apply displacement when calculating face points
      const firstPoint = amplifierEdges([
        edges[i][0][0] + displacement[0],
        edges[i][0][1] + displacement[1],
        Z,
      ]);
      facesZ.push([firstPoint[0], firstPoint[1], Z + displacement[2]]);
      facesZDepth.push([firstPoint[0], firstPoint[1], -Z + displacement[2]]);
      for (let j = edges[i].length - 1; j >= 0; j--) {
        const [x, y] = amplifierEdges([
          edges[i][j][0] + displacement[0],
          edges[i][j][1] + displacement[1],
          Z,
        ]);
        facesZ.push([x, y, Z + displacement[2]]);
        facesZDepth.push([x, y, -Z + displacement[2]]);
      }
    }

    for (let hole of edges) {
      for (let j = 0; j < hole.length - 1; j++) {
        const [x, y] = amplifierEdges([
          hole[j][0] + displacement[0],
          hole[j][1] + displacement[1],
          Z,
        ]);
        const [xNextFace, yNextFace] = amplifierEdges([
          hole[j + 1][0] + displacement[0],
          hole[j + 1][1] + displacement[1],
          Z,
        ]);

        facesConnections.push([
          [x, y, Z + displacement[2]],
          [xNextFace, yNextFace, Z + displacement[2]],
          [xNextFace, yNextFace, -Z + displacement[2]],
          [x, y, -Z + displacement[2]],
          [x, y, Z + displacement[2]],
        ]);
      }
    }

    this.faces = [facesZ, facesZDepth, ...facesConnections];

    console.debug(this.faces);

    this.calculateFacesNormal();
    this.findFacesCentroid();
  }

  calculateFacesNormal() {
    const facesNormal: vec3[] = [];

    for (let face of this.faces) {
      const normal = getNormal(face);
      facesNormal.push(normal.array() as vec3);
    }

    this.facesNormal = facesNormal;
  }

  findFacesCentroid() {
    this.facesCentroid = this.faces.map((face) => getCentroidFaces(face));
  }

  draw(p5: p5Types, camera: Camera, shader: p5Types.Shader, light: Light) {
    // const Nvector = p5.createVector(...camera.N);
    const VRP = p5.createVector(...camera.VRP);

    const distance = p5
      .createVector(...camera.N)
      .dot(p5.createVector(...camera.VRP).sub(p5.createVector(...this.center)));

    if (distance < camera.near || distance > camera.far) return;

    //Repassa os dados para o shader
    // shader?.setUniform('Ka', [...[0.1, 0.5, 0.1]]);
    // shader?.setUniform('Kd', [...[0.1, 0.5, 0.1]]);
    // shader?.setUniform('Ks', [...[0.1, 0.1, 0.1]]);
    // shader?.setUniform('ObserverPosition', [...camera.VRP]);
    // shader?.setUniform('LightPosition', [...light.position]);
    // shader?.setUniform('uN', 1);
    // shader?.setUniform('Ila', [...light.ambientLightIntensity]);
    // shader?.setUniform('Il', [...light.lightIntensity]);
    // shader?.setUniform('uLightType', light.lightType);

    for (let i = 0; i < this.faces.length; i++) {
      const face = this.faces[i];

      if (camera.ocultFaces) {
        const OVector = VRP.sub(...this.facesCentroid[i]).normalize();
        const faceNormal = p5.createVector(...this.facesNormal[i]);

        const dot = OVector.dot(faceNormal);

        //Caso a face esteja na frente da camera, ela será desenhada
        if (dot < 0.00000000001) continue;
      }

      // shader?.setUniform('ReferencePointPosition', getCentroidFaces(face));
      // shader?.setUniform('FaceNormal', [...faceNormal.array()]);

      p5.stroke(255);
      p5.beginShape();

      let firstPoint = face[0];
      for (let j = 1; j < face.length; j++) {
        const vertex = face[j];

        const [x, y, z] = matrixMul(
          [vertex[0], vertex[1], vertex[2]],
          camera.concatedMatrix
        ) as any;
        p5.vertex(x, y, z);
        if (
          vertex[0] === firstPoint[0] &&
          vertex[1] === firstPoint[1] &&
          vertex[2] === firstPoint[2]
        ) {
          p5.endShape(p5.CLOSE);
          p5.beginShape();
          firstPoint = face[j + 1];

          j++;
        }
      }
      p5.endShape(p5.CLOSE);
    }
  }

  public scanline(camera: Camera, zBufferMatrix: number[][]) {
    const p5 = p5Types.Vector;
    const VRP = new p5(...camera.VRP);

    const distance = new p5(...camera.N).dot(
      new p5(...camera.VRP).sub(new p5(...this.center))
    );

    if (distance < camera.near || distance > camera.far) return;

    for (let i = 0; i < this.faces.length; i++) {
      const face = this.faces[i];

      const OVector = VRP.sub(...this.facesCentroid[i]).normalize();
      const faceNormal = new p5(...this.facesNormal[i]);

      const dot = OVector.dot(faceNormal);

      if (dot < 0.00000000001)
        //Caso a face esteja na frente da camera, ela será desenhada
        continue;

      //Irá fazer a scanline para o objeto
      for (let edge of face) {
        const [x, y, z] = matrixMul(
          [edge[0], edge[1], edge[2]],
          camera.concatedMatrix
        ) as vec3;
      }
    }
  }

  //Translada a letra
  translate(tX: number, tY: number, tZ: number) {
    //Move o centro
    this.center = translate(this.center, tX, tY, tZ) as vec3;
    //Move os vértices
    this.faces = this.faces.map((vec3) =>
      translate(vec3, tX, tY, tZ)
    ) as vec3[][];

    this.findFacesCentroid();
  }

  //Rotaciona a letra
  rotate(angle: number, option: 'X' | 'Y' | 'Z') {
    const [x, y, z] = this.center;
    //Translada o centro para o centro da letra
    let NCenter = translate(this.center, -x, -y, -z) as vec3;
    //Translada os pontos para o centro da letra
    let NFaces = this.faces.map((vec3) =>
      translate(vec3, -x, -y, -z)
    ) as vec3[][];

    //Rotaciona os pontos
    NFaces = NFaces.map((vec3) => rotate(vec3, angle, option)) as vec3[][];
    //Rotaciona o centro
    NCenter = rotate(NCenter, angle, option) as vec3;

    //Devolve ao centro da letra
    this.center = translate(NCenter, x, y, z) as vec3;
    //Devolve os pontos da letra
    this.faces = NFaces.map((vec3) => translate(vec3, x, y, z)) as vec3[][];

    this.calculateFacesNormal();
    this.findFacesCentroid();
  }

  //Escala a letra
  scale(sX: number, sY: number, sZ: number) {
    const [x, y, z] = this.center;

    let Ncenter = translate(this.center, -x, -y, -z) as vec3;
    let NFaces = this.faces.map((vec3) =>
      translate(vec3, -x, -y, -z)
    ) as vec3[][];

    //Escala o centro
    Ncenter = scale(Ncenter, sX, sY, sZ) as vec3;
    //Escala os vértices
    NFaces = NFaces.map((vec3) => scale(vec3, sX, sY, sZ)) as vec3[][];

    //Move o centro
    this.center = translate(Ncenter, x, y, z) as vec3;
    //Translada os vértices para o centro
    this.faces = NFaces.map((vec3) => translate(vec3, x, y, z)) as vec3[][];

    this.findFacesCentroid();
  }
}
