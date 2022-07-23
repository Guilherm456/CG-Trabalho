import p5Types from 'p5';

//Recebe uma face e retorna a sua normal
export function getNormal(p5: p5Types, toNormal: number[][]) {
  const P1 = p5.createVector(...toNormal[0]);
  const P2 = p5.createVector(...toNormal[1]);
  const P3 = p5.createVector(...toNormal[2]);

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
