import { Coord, Port } from 'utils/interfaces';

import p5Types from 'p5';
const p5 = p5Types.Vector;

export class Camera {
  public VRP: Coord;
  public P: Coord;

  private N: Coord = [0, 0, 0];
  private U: Coord = [0, 0, 0];
  private V: Coord = [0, 0, 0];

  public ViewPort: Port;
  public WindowPort: Port;

  public matrixSRUSRC: Coord[] = [[0, 0, 0]];
  public matrixProjection: Coord[] = [[0, 0, 0]];
  public matrixView: number[][] = [[0, 0, 0, 0]];

  constructor(
    position: Coord,
    target: Coord,
    viewport: Port,
    windowPort: Port
  ) {
    this.VRP = position;
    this.P = target ?? [0, 0, 0];

    this.ViewPort = viewport;

    this.WindowPort = windowPort;

    this.getAllValues();
    this.matrixView = this.getMatrixView();
  }

  public setVRP(x: number, y: number, z: number) {
    this.VRP = [x, y, z];
    this.getAllValues();
  }

  public setP(x: number, y: number, z: number) {
    this.P = [x, y, z];
    this.getAllValues();
  }

  public updateVRP_P(VRP: Coord, P: Coord) {
    this.VRP = VRP;
    this.P = P;

    this.getAllValues();
  }

  public setWindowSize(windowPort?: Port, viewPort?: Port) {
    this.WindowPort = windowPort ?? this.WindowPort;
    this.ViewPort = viewPort ?? this.ViewPort;

    this.matrixView = this.getMatrixView();
  }

  private getAllValues(): void {
    this.N = this.getN();
    this.V = this.getV();
    this.U = this.getU();
    this.matrixSRUSRC = this.convertToSRC();
    this.matrixProjection = this.getProjectionMatrix();
  }

  private getN(): Coord {
    const { VRP, P } = this;

    const PVector = new p5(...P);
    const VRPVector = new p5(...VRP);
    return p5.sub(VRPVector, PVector).normalize().array() as Coord;
  }

  private getV(): Coord {
    const { N } = this;

    const YVector = new p5(0, 1, 0);
    const NVector = new p5(...N);

    const scalar = YVector.dot(NVector);
    return p5.sub(YVector, NVector.mult(scalar)).normalize().array() as Coord;
  }

  private getU(): Coord {
    const { V, N } = this;

    const NVector = new p5(...N);
    const VVector = new p5(...V);
    return VVector.cross(NVector).normalize().array() as Coord;
  }

  convertToSRC(): Coord[] {
    const { VRP, N, U, V } = this;
    const negativeVRP = new p5(...VRP).mult(-1);

    const UVector = new p5(...U);
    const VVector = new p5(...V);
    const NVector = new p5(...N);

    const MatrixSRU_SRC = [
      [...U, negativeVRP.dot(UVector)],
      [...V, negativeVRP.dot(VVector)],
      [...N, negativeVRP.dot(NVector)],
      [0, 0, 0, 1],
    ];
    return MatrixSRU_SRC as Coord[];
  }

  getProjectionMatrix(): Coord[] {
    const { VRP, P } = this;

    const VRPVector = new p5(...VRP);
    const PVector = new p5(...P);

    const Dp = VRPVector.dist(PVector);
    const Zvp = -Dp;

    const matrixP = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, Zvp / Dp, 0],
      [0, 0, -1 / Dp, 0],
    ];
    return matrixP as Coord[];
  }

  getMatrixView() {
    const { ViewPort, WindowPort } = this;
    const [xMin, xMax] = WindowPort.width;
    const [yMin, yMax] = WindowPort.height;

    const [uMin, uMax] = ViewPort.width;
    const [vMin, vMax] = ViewPort.height;
    const matrix = [
      [
        (uMax - uMin) / (xMax - xMin),
        0,
        0,
        -xMin * ((uMax - uMin) / (xMax - xMin)) + uMin,
      ],
      [
        0,
        (vMin - vMax) / (yMax - yMin),
        0,
        yMin * ((vMax - vMin) / (yMax - yMin)) + vMax,
      ],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    return matrix;
  }

  updatePositionCamera(walked: number, axios: 'X' | 'Y' | 'Z', VRP: boolean) {
    const coord = VRP ? this.VRP : this.P;

    if (axios === 'X') coord[0] += walked;

    if (axios === 'Y') coord[1] += walked;

    if (axios === 'Z') coord[2] += walked;

    if (VRP) this.VRP = coord;
    else this.P = coord;

    this.getAllValues();
  }
}
