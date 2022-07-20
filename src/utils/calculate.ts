import { vec3, vec4 } from './interfaces';
import * as numjs from 'numjs';

type MatrixN = number[][];

export function translate(
  matrix: vec3[] | vec3 | vec4,
  dx: number,
  dy: number,
  dz: number
): vec3[] | vec3 | vec4 {
  const matrixCalc: MatrixN = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  //Verifica se é todas as posições ou apenas uma
  if (matrix[0].constructor !== Array) {
    return matrixMul(matrix as vec3 | vec4, matrixCalc);
  } else
    return matrix.map((vec3) => {
      return matrixMul(vec3 as vec3, matrixCalc);
    }) as vec3[];
}

export function rotate(
  matrix: vec3[] | vec3 | vec4,
  ang: number,
  option: 'X' | 'Y' | 'Z'
): vec3[] | vec3 | vec4 {
  let rotO: number[][];
  ang = toDegrees(ang);
  if (option === 'X') {
    rotO = [
      [1, 0, 0, 0],
      [0, Math.cos(ang), -Math.sin(ang), 0],
      [0, Math.sin(ang), Math.cos(ang), 0],
      [0, 0, 0, 1],
    ];
  } else if (option === 'Y') {
    rotO = [
      [Math.cos(ang), 0, Math.sin(ang), 0],
      [0, 1, 0, 0],
      [-Math.sin(ang), 0, Math.cos(ang), 0],
      [0, 0, 0, 1],
    ];
  } else if (option === 'Z') {
    rotO = [
      [Math.cos(ang), -Math.sin(ang), 0, 0],
      [Math.sin(ang), Math.cos(ang), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  } else {
    return matrix;
  }

  //Verifica se é todas as posições ou apenas uma
  if (matrix[0].constructor !== Array) {
    return matrixMul(matrix as vec3 | vec4, rotO);
  } else {
    return matrix.map((vec3) => {
      return matrixMul(vec3 as vec3, rotO);
    }) as vec3[];
  }
}

export function scale(
  matrix: vec3[] | vec3 | vec4,
  sX: number,
  sY: number,
  sZ: number
): vec3[] | vec3 | vec4 {
  const matrixCalc = [
    [sX, 0, 0, 0],
    [0, sY, 0, 0],
    [0, 0, sZ, 0],
    [0, 0, 0, 1],
  ];

  //Verifica se é todas as posições ou apenas uma
  if (matrix[0].constructor !== Array) {
    return matrixMul(matrix as vec3 | vec4, matrixCalc);
  } else {
    return matrix.map((vec3) => {
      return matrixMul(vec3 as vec3, matrixCalc);
    }) as vec3[];
  }
}

//Faz a multiplicação de matrizes
export function matrixMul(
  vec3: vec3 | vec4,
  matrixCalc: number[][]
): vec3 | vec3[] | vec4 {
  //Vai adicionar o "1" necessário para multiplicar a matriz pelo vetor
  if (vec3.length === 3) vec3.push(1);

  //Multiplica a matriz pelo vetor

  const result = numjs.dot(numjs.array(matrixCalc), numjs.array<any>(vec3));
  if (vec3.length > 3) return result.tolist() as vec3;
  else
    return (
      result
        .tolist()
        //Corta o "1" que foi adicionado
        .slice(0, 3) as vec3[] | vec3
    );
}

export function transpose(matrix: vec3[]): vec3[] {
  return numjs.array(matrix).transpose().tolist();
}

export function toDegrees(angle: number) {
  return angle * (Math.PI / 180);
}
