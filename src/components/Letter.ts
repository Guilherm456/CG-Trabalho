import p5Types from 'p5';
import { matrixMul, rotate, scale, translate } from 'utils/calculate';
import Letters from 'utils/font';
import { vec3 } from 'utils/interfaces';
import { getNormal } from 'utils/others';
import { Camera } from './Camera';
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
  private faces: number[][] = [];

  edges: [[vec3]] = [[[-1, -1, -1]]];

  private center: vec3 = [0, 0, 0];

  private ZDepth: number = 0;

  readonly id: String;

  private size: number = 10;

  public edgesCamera: [[vec3]] = [[[-1, -1, -1]]];

  public typeLetter: TypeLetter = 'A';

  private concatedMatrix: number[][] = [];

  constructor(center: vec3, ZDepth: number, typeLetter: TypeLetter) {
    this.center = center;
    this.ZDepth = ZDepth;

    this.edges = Letters[typeLetter] as any;
    this.findFaces();
    this.typeLetter = typeLetter;

    this.id = Math.ceil(Math.random() * Date.now())
      .toPrecision(3)
      .toString()
      .replace('.', '');
  }

  private findFaces() {
    const faces: number[][][] = [];
    // Loop through the edges and connect them to form faces
    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i];

      // Connect the vertices of the current edge with the next edge in the different Z plane
      for (let j = 0; j < edge.length; j++) {
        const currentVertex = edge[j];
        const nextVertex = edge[(j + 1) % edge.length]; // Wrap around to the first vertex

        // Create vertices with the same X and Y coordinates but different Z coordinates
        const newVertex1: number[] = [
          currentVertex[0],
          currentVertex[1],
          this.ZDepth,
        ];
        const newVertex2: number[] = [
          nextVertex[0],
          nextVertex[1],
          this.ZDepth,
        ];
        const newVertex3: number[] = [currentVertex[0], currentVertex[1], 0.0];
        const newVertex4: number[] = [nextVertex[0], nextVertex[1], 0.0];

        // Add the vertices to the current face
        const face1: number[][] = [
          currentVertex,
          newVertex1,
          newVertex2,
          nextVertex,
        ];
        const face2: number[][] = [
          currentVertex,
          nextVertex,
          newVertex4,
          newVertex3,
        ];

        // Add the completed faces to the list of faces
        faces.push(face1, face2);
      }
    }

    this.edges = faces as any;
  }

  public calculatePoints(concatedMatrix: number[][]) {
    this.concatedMatrix = concatedMatrix;
    console.debug(this.concatedMatrix);
    for (let i = 0; i < this.edges.length; i++) {
      const points = [];
      for (let j = 0; j < this.edges[i].length; j++) {
        const edge = this.edges[i][j];
        const [x, y, z] = matrixMul(
          [
            (edge[0] + this.center[0]) * this.size,
            edge[1] * this.size,
            edge[2],
          ],
          concatedMatrix
        ) as any;
        points.push([x, y, z]);
      }
      this.edgesCamera[i] = points as any;
    }
    console.debug('a', this.edgesCamera, this.edges);
  }

  draw(p5: p5Types, camera: Camera) {
    const Nvector = p5.createVector(...camera.N);
    const distance = p5
      .createVector(...camera.N)
      .dot(p5.createVector(...camera.VRP).sub(p5.createVector(...this.center)));

    if (distance < camera.near || distance > camera.far) return;

    for (let i = 0; i < this.edgesCamera.length; i++) {
      const face = this.edges[i];

      if (camera.ocultFaces) {
        const faceNormal = getNormal(p5, face);
        const dot = Nvector.dot(faceNormal);

        //Caso a face esteja na frente da camera, ela será desenhada
        if (dot > 0.000000001) continue;
      }

      p5.stroke(255);

      p5.beginShape();
      for (const [xVertex, yVertex, zVertex] of face) {
        // p5.vertex(xVertex, yVertex, zVertex);
        const [x, y, z] = matrixMul(
          [
            (xVertex + this.center[0]) * this.size,
            yVertex * this.size,
            zVertex,
          ],
          this.concatedMatrix
        ) as any;
        p5.vertex(x, y, z);

        // console.debug([x, y, z], this.edgesCamera[i][j]);
      }
      p5.endShape(p5.CLOSE);
    }
  }

  translateLetter(tX: number, tY: number, tZ: number) {
    //Move o centro
    this.center = translate(this.center, tX, tY, tZ) as vec3;
    //Move os vértices
    this.edges = this.edges.map((vec3) => translate(vec3, tX, tY, tZ)) as [
      [vec3]
    ];
  }
  rotateLetter(angle: number, option: 'X' | 'Y' | 'Z') {
    const [x, y, z] = this.center;
    //Translada o centro para o centro da letra
    let NCenter = translate(this.center, -x, -y, -z) as vec3;
    //Translada os pontos para o centro da letra
    let NVertice = this.edges.map((vec3) => translate(vec3, -x, -y, -z));

    //Rotaciona os pontos
    NVertice = NVertice.map((vec3) => rotate(vec3, angle, option));
    //Rotaciona o centro
    NCenter = rotate(NCenter, angle, option) as vec3;

    //Devolve ao centro da letra
    this.center = translate(NCenter, x, y, z) as vec3;
    //Devolve os pontos da letra
    this.edges = NVertice.map((vec3) => translate(vec3, x, y, z)) as [[vec3]];
  }

  //Escala a letra
  scaleLetter(sX: number, sY: number, sZ: number) {
    const [x, y, z] = this.center;

    let Ncenter = translate(this.center, -x, -y, -z) as vec3;
    let Nvertice = this.edges.map((vec3) => translate(vec3, -x, -y, -z));

    //Escala o centro
    Ncenter = scale(Ncenter, sX, sY, sZ) as vec3;
    //Escala os vértices
    Nvertice = Nvertice.map((vec3) => scale(vec3, sX, sY, sZ)) as vec3[][];

    //Move o centro
    this.center = translate(Ncenter, x, y, z) as vec3;
    //Translada os vértices para o centro
    this.edges = Nvertice.map((vec3) => translate(vec3, x, y, z)) as [[vec3]];
  }
}
