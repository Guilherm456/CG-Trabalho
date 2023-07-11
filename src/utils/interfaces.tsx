export interface Port {
  width: [number, number];
  height: [number, number];
}
export type vec3 = [number, number, number];

export type vec4 = [number, number, number, number];

export type LetterType = {
  center: vec3;
  ZDepth: number;
  typeLetter: TypeLetter;
  Ka: vec3;
  Kd: vec3;
  Ks: vec3;
  n: number;
  faces: vec3[][];
};

export type TypeLetter =
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
