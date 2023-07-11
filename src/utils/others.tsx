import p5Types from 'p5';
import { vec3 } from './interfaces';

//Recebe uma face e retorna a sua normal
export function getNormal(toNormal: number[][]) {
  const p5 = p5Types.Vector;

  const P1 = new p5(...toNormal[0]);
  const P2 = new p5(...toNormal[1]);
  const P3 = new p5(...toNormal[2]);

  const v1 = P1.sub(P2);
  const v2 = P3.sub(P2);
  //P3-P2 * P1-P2
  const value = v1.cross(v2).normalize();
  return value;
}

//Transforma um vetor de números em vetor de string para inputs
export function arrayNumberToArrayString(array?: number[]) {
  if (!array) return ['0', '0', '0'];
  return array.map((item) => item.toString());
}

//Faz o "clamp" de um número (limita o valor entre um intervalo)
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getCentroidFaces(face: number[][]): vec3 {
  const x = [
    Math.min(...face.map(([x]) => x)),
    Math.max(...face.map(([x]) => x)),
  ];
  const y = [
    Math.min(...face.map(([, y]) => y)),
    Math.max(...face.map(([, y]) => y)),
  ];
  const z = [
    Math.min(...face.map(([, , z]) => z)),
    Math.max(...face.map(([, , z]) => z)),
  ];

  const xCenter = (x[0] + x[1]) / 2;
  const yCenter = (y[0] + y[1]) / 2;
  const zCenter = (z[0] + z[1]) / 2;
  return [xCenter, yCenter, zCenter] as vec3;
}

export const amplifierEdges = (edge: vec3): vec3 => {
  return [edge[0] * 10, edge[1] * 10, edge[2]];
};
