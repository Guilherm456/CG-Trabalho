import { vec3, Port } from 'utils/interfaces';
import * as numjs from 'numjs';

import p5Types from 'p5';
const p5 = p5Types.Vector;

export class Camera {
  public VRP: vec3;
  public P: vec3;

  public perspective: boolean;

  public N: vec3 = [0, 0, 0];
  public U: vec3 = [0, 0, 0];
  public V: vec3 = [0, 0, 0];

  public viewUp: vec3 = [0, 1, 0];
  public projectionPlanDistance: number = 1;
  private projectionPlan: vec3 = [0, 0, 0];

  public ViewPort: Port;
  public WindowPort: Port;

  public matrixSRUSRC: number[][] = [[0, 0, 0]];
  public matrixProjection: number[][] = [[0, 0, 0]];
  public matrixView: number[][] = [[0, 0, 0, 0]];

  public concatedMatrix: number[][] = [[0, 0, 0, 0]];

  public far: number = 1000;
  public near: number = 0.1;

  public sensitivity: number = 1;

  constructor(
    position: vec3,
    target: vec3,
    viewport: Port,
    windowPort: Port,
    far: number,
    near: number,
    lookAp?: vec3,
    planCenterDistance?: number,
    perspective?: boolean
  ) {
    this.VRP = position;
    this.P = target ?? [0, 0, 0];
    this.perspective = perspective ?? false;

    this.viewUp = lookAp ?? this.viewUp;

    this.setPlanDistance(planCenterDistance ?? 100);
    this.ViewPort = viewport;

    this.WindowPort = windowPort;

    this.matrixView = this.getMatrixView();
    this.getAllValues();

    this.far = far;
    this.near = near;
  }

  public setDistances(far?: number, near?: number) {
    this.far = far ?? this.far;
    this.near = near ?? this.near;
  }

  public setVRP(x: number, y: number, z: number) {
    this.VRP = [x, y, z];
    this.getAllValues();
  }

  public setP(x: number, y: number, z: number) {
    this.P = [x, y, z];
    this.getAllValues();
  }

  public updateVRP_P(VRP: vec3, P: vec3) {
    this.VRP = VRP;
    this.P = P;

    this.getAllValues();
  }

  public setSenitivity(sensitivity: number) {
    this.sensitivity = sensitivity;
  }

  public setPlanDistance(distance: number) {
    this.projectionPlanDistance = distance / 100;
    const { VRP, P, projectionPlanDistance } = this;

    const [xVRP, yVRP, zVRP] = VRP;
    const [xP, yP, zP] = P;

    this.projectionPlan = [
      xVRP + (xP - xVRP * projectionPlanDistance),
      yVRP + (yP - yVRP * projectionPlanDistance),
      zVRP + (zP - zVRP * projectionPlanDistance),
    ];
  }
  public setviewUp(viewUp: vec3) {
    this.viewUp = viewUp;
    this.getAllValues();
  }

  public setWindowSize(windowPort?: Port, viewPort?: Port) {
    this.WindowPort = windowPort ?? this.WindowPort;
    this.ViewPort = viewPort ?? this.ViewPort;

    this.matrixView = this.getMatrixView();
    this.concatedMatrix = this.getConcatedMatrix();
  }

  public setTypePerspective(perspective: boolean) {
    this.perspective = perspective;
    this.getAllValues();
  }

  private getAllValues(): void {
    this.N = this.getN();
    this.V = this.getV();
    this.U = this.getU();
    this.matrixSRUSRC = this.convertToSRC();
    this.matrixProjection = this.getProjectionMatrix();
    this.concatedMatrix = this.getConcatedMatrix();
  }

  private getN(): vec3 {
    const { VRP, P } = this;

    const PVector = new p5(...P);
    const VRPVector = new p5(...VRP);
    return VRPVector.sub(PVector).normalize().array() as vec3;
  }

  private getV(): vec3 {
    const { N, viewUp } = this;

    const YVector = new p5(...viewUp);
    const NVector = new p5(...N);

    const scalar = YVector.dot(NVector);
    return p5.sub(YVector, NVector.mult(scalar)).normalize().array() as vec3;
  }

  private getU(): vec3 {
    const { V, N } = this;

    const NVector = new p5(...N);
    const VVector = new p5(...V);
    return VVector.cross(NVector).normalize().array() as vec3;
  }

  convertToSRC(): number[][] {
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
    return MatrixSRU_SRC;
  }

  getProjectionMatrix(): number[][] {
    const { VRP, projectionPlan } = this;

    const VRPVector = new p5(...VRP);
    const ProjectionVector = new p5(...projectionPlan);

    const Dp = VRPVector.dist(ProjectionVector);
    const Zvp = -Dp;

    if (this.perspective) {
      const matrixP = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, -Zvp / Dp, 0],
        [0, 0, -1 / Dp, 0],
      ];
      return matrixP;
    } else {
      const matrixP = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
      ];
      return matrixP;
    }
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
        (vMax - vMin) / (yMax - yMin),
        0,
        -yMin * ((vMax - vMin) / (yMax - yMin)) + vMin,
      ],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    // const matrix = [
    //   [
    //     (uMax - uMin) / (xMax - xMin),
    //     0,
    //     0,
    //     -xMin * ((uMax - uMin) / (xMax - xMin)) + uMin,
    //   ],
    //   [
    //     0,
    //     (vMin - vMax) / (yMax - yMin),
    //     0,
    //     yMin * ((vMax - vMin) / (yMax - yMin)) + vMax,
    //   ],
    //   [0, 0, 1, 0],
    //   [0, 0, 0, 1],
    // ];
    return matrix;
  }

  public getConcatedMatrix(): number[][] {
    const { matrixSRUSRC, matrixProjection, matrixView } = this;

    let concatedMatrix = numjs
      .dot(matrixView, matrixProjection)
      .dot(matrixSRUSRC);

    return concatedMatrix.tolist();
  }

  updatePositionCamera(walked: number, axios: 'X' | 'Y' | 'Z', VRP: boolean) {
    const vec3 = VRP ? this.VRP : this.P;

    if (axios === 'X') vec3[0] += walked;

    if (axios === 'Y') vec3[1] += walked;

    if (axios === 'Z') vec3[2] += walked;

    if (VRP) this.VRP = vec3;
    else this.P = vec3;

    this.getAllValues();
  }
}
