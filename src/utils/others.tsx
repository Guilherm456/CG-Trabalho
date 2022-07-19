import p5Types from 'p5';

export function HexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

export function getNormal(p5: p5Types, toNormal: number[][]) {
  const P1 = p5.createVector(...toNormal[0]);
  const P2 = p5.createVector(...toNormal[1]);
  const P3 = p5.createVector(...toNormal[2]);

  const value = P3.sub(P2).cross(P1.sub(P2)).normalize();
  return value;
}

export function arrayNumberToArrayString(array?: number[]) {
  if (!array) return ['0', '0', '0'];
  return array.map((item) => item.toString());
}
