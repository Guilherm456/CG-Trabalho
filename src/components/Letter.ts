import p5Types from 'p5';
import { matrixMul } from 'utils/calculate';
import Letters from 'utils/font';
import { vec3 } from 'utils/interfaces';
import { amplifierEdges, getCentroidFaces, getNormal } from 'utils/others';
import { Camera } from './Camera';
import { Light } from './Light';
type TypeLetter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'X'
  | 'W'
  | 'Y'
  | 'Z'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export class Letter {
  private faces: vec3[][] = [];

  private facesNormal: vec3[] = [];

  private facesCentroid: vec3[] = [];

  edges: [[vec3]] = [[[-1, -1, -1]]];

  private center: vec3 = [0, 0, 0];

  private ZDepth: number = 0;

  readonly id: string;

  readonly typeLetter: TypeLetter = 'A';

  constructor(center: vec3, ZDepth: number, typeLetter: TypeLetter) {
    this.center = center;
    this.ZDepth = ZDepth;

    this.typeLetter = typeLetter;

    this.id = Math.ceil(Math.random() * Date.now())
      .toPrecision(3)
      .toString()
      .replace('.', '');
    this.findFaces();
  }

  private findFaces() {
    const Z = this.ZDepth / 2;

    const edges = Letters[this.typeLetter] as vec3[][];

    const facesZ: vec3[] = [];
    const facesConnections: vec3[][] = [];
    const facesZDepth: vec3[] = [];
    for (let i = 0; i < edges.length; i++) {
      const firstPoint = amplifierEdges(edges[i][0]);
      facesZ.push([firstPoint[0], firstPoint[1], Z]);
      facesZDepth.push([firstPoint[0], firstPoint[1], -Z]);
      for (let j = edges[i].length - 1; j >= 0; j--) {
        const [x, y] = amplifierEdges(edges[i][j]);
        facesZ.push([x, y, Z]);
        facesZDepth.push([x, y, -Z]);
      }
    }

    for (let hole of edges) {
      for (let j = 0; j < hole.length - 1; j++) {
        const [x, y] = amplifierEdges(hole[j]);
        const [xNextFace, yNextFace] = amplifierEdges(hole[j + 1]);

        facesConnections.push([
          [x, y, Z],
          [xNextFace, yNextFace, Z],
          [xNextFace, yNextFace, -Z],
          [x, y, -Z],
          [x, y, Z],
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

      const OVector = VRP.sub(...this.facesCentroid[i]).normalize();
      const faceNormal = p5.createVector(...this.facesNormal[i]);

      const dot = OVector.dot(faceNormal);

      // //Caso a face esteja na frente da camera, ela será desenhada
      // if (dot < 0.00000000001) continue;

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
}
