import { Coord } from './interfaces';
import * as numjs from 'numjs';

type MatrixN = number[][];

export function translate(
  matrix: Coord[],
  dx: number,
  dy: number,
  dz: number
): Coord[] {
  const matrixCalc: MatrixN = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  return matrix.map((coord) => {
    return matrixMul(coord, matrixCalc);
  }) as Coord[];
}

export function rotate(
  matrix: Coord[],
  ang: number,
  option: 'X' | 'Y' | 'Z'
): Coord[] {
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

  return matrix.map((coord) => {
    return matrixMul(coord, rotO);
  }) as Coord[];
}

export function scale(
  matrix: Coord[],
  sX: number,
  sY: number,
  sZ: number
): Coord[] {
  const matrixCalc = [
    [sX, 0, 0, 0],
    [0, sY, 0, 0],
    [0, 0, sZ, 0],
    [0, 0, 0, 1],
  ];

  return matrix.map((coord) => {
    return matrixMul(coord, matrixCalc);
  }) as Coord[];
}

//Faz a multiplicação de matrizes
function matrixMul(coord: Coord, matrixCalc: number[][]) {
  //Vai adicionar o "1" necessário para multiplicar a matriz pelo vetor
  coord.push(1);
  //Multiplica a matriz pelo vetor
  return (
    numjs
      .dot(matrixCalc, numjs.array<any>(coord))
      .tolist()
      //Corta o "1" que foi adicionado
      .slice(0, 3)
  );
}

export function toDegrees(angle: number) {
  return angle * (Math.PI / 180);
}
