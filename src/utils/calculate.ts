import { Coord } from './interfaces';
import * as numjs from 'numjs';

type MatrixN = number[][];

export function translate(
  matrix: Coord[] | Coord,
  dx: number,
  dy: number,
  dz: number
) {
  const matrixCalc: MatrixN = [
    [1, 0, 0, dx],
    [0, 1, 0, dy],
    [0, 0, 1, dz],
    [0, 0, 0, 1],
  ];

  //Verifica se é todas as posições ou apenas uma
  if (matrix.length === 3) {
    return matrixMul(matrix as Coord, matrixCalc);
  } else
    return matrix.map((coord) => {
      return matrixMul(coord as Coord, matrixCalc);
    }) as Coord[];
}

export function rotate(
  matrix: Coord[] | Coord,
  ang: number,
  option: 'X' | 'Y' | 'Z'
) {
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
  if (matrix.length === 3) {
    return matrixMul(matrix as Coord, rotO);
  } else {
    return matrix.map((coord) => {
      return matrixMul(coord as Coord, rotO);
    }) as Coord[];
  }
}

export function scale(
  matrix: Coord[] | Coord,
  sX: number,
  sY: number,
  sZ: number
) {
  const matrixCalc = [
    [sX, 0, 0, 0],
    [0, sY, 0, 0],
    [0, 0, sZ, 0],
    [0, 0, 0, 1],
  ];

  //Verifica se é todas as posições ou apenas uma
  if (matrix.length === 3) {
    return matrixMul(matrix as Coord, matrixCalc);
  } else {
    return matrix.map((coord) => {
      return matrixMul(coord as Coord, matrixCalc);
    }) as Coord[];
  }
}

//Faz a multiplicação de matrizes
function matrixMul(coord: Coord, matrixCalc: number[][]): Coord | Coord[] {
  //Vai adicionar o "1" necessário para multiplicar a matriz pelo vetor
  if (coord.length === 3) coord.push(1);
  //Multiplica a matriz pelo vetor

  const result = numjs.dot(numjs.array(matrixCalc), numjs.array<any>(coord));
  return (
    result
      .tolist()
      //Corta o "1" que foi adicionado
      .slice(0, 3) as Coord[] | Coord
  );
}

export function transpose(matrix: Coord[]): Coord[] {
  return numjs.array(matrix).transpose().tolist();
}

export function toDegrees(angle: number) {
  return angle * (Math.PI / 180);
}
