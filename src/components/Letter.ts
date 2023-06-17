import p5Types from 'p5';
import { matrixMul } from 'utils/calculate';
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

  private edges: [[vec3]] = [[[-1, -1, -1]]];

  private center: vec3 = [0, 0, 0];

  private ZDepth: number = 0;

  private size: number = 100;

  readonly id: string;

  readonly typeLetter: TypeLetter = 'A';

  constructor(center: vec3, ZDepth: number, typeLetter: TypeLetter) {
    this.center = center;
    this.ZDepth = ZDepth;

    this.edges = Letters[typeLetter] as any;
    this.typeLetter = typeLetter;

    this.id = Math.ceil(Math.random() * Date.now())
      .toPrecision(3)
      .toString()
      .replace('.', '');
    this.findFaces();
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

  private amplificador = 100;
  draw(p5: p5Types, camera: Camera) {
    const Nvector = p5.createVector(...camera.N);
    const distance = p5
      .createVector(...camera.N)
      .dot(p5.createVector(...camera.VRP).sub(p5.createVector(...this.center)));

    if (distance < camera.near || distance > camera.far) return;

    for (let i = 0; i < this.edges.length; i++) {
      const face = this.edges[i];
      const faceNormal = getNormal(p5, face);
      // console.debug(faceNormal, Nvector);
      const dot = Nvector.dot(faceNormal);

      // console.debug(dot);
      //Caso a face esteja na frente da camera, ela será desenhada
      if (dot < 0) continue;

      p5.stroke(255);

      p5.beginShape();
      for (const vertex of face) {
        const [x, y, z] = matrixMul(
          [
            vertex[0] * this.amplificador,
            vertex[1] * this.amplificador,
            vertex[2],
          ],
          camera.concatedMatrix
        ) as any;
        // const [x, y, z] = vertex;
        p5.vertex(x, y, z);
      }
      p5.endShape(p5.CLOSE);
    }
  }
}
