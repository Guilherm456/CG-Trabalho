import nj from '@d4c/numjs';
import { Port, vec3 } from 'utils/interfaces';

import p5Types from 'p5';
const p5 = p5Types.Vector;

//OBS: Alguns valores precisam ser atualizados após a alteração de outro valor
type CameraType =
  | 'perspective'
  | 'axonometric-top'
  | 'axonometric-front'
  | 'axonometric-side'
  | 'axonometric';
export class Camera {
  //"Posição da câmera"
  public VRP: vec3;
  //Para onde está "olhando"
  public P: vec3;

  //Se é perspectiva ou não
  public typeCamera: CameraType;

  //Vetores que são usados para SRC
  public N: vec3 = [0, 0, 0];
  public U: vec3 = [0, 0, 0];
  public V: vec3 = [0, 0, 0];

  //Vetor (Y) que é usado para calcular vetor V
  public viewUp: vec3 = [0, 1, 0];

  //Distânca do plano de projeção (0 a 1)
  public projectionPlanDistance: number = 1;

  //O vetor do plano de projeção
  public projectionPlan: vec3 = [0, 0, 0];

  //Os valores do viewport
  public ViewPort: Port;
  //Os valores do WindowPort
  public WindowPort: Port;

  //Matriz SRC
  public matrixSRUSRC: number[][] = [[0, 0, 0]];

  //Matriz Projeção
  public matrixProjection: number[][] = [[0, 0, 0]];

  //Matriz View || Matriz de Window
  public matrixView: number[][] = [[0, 0, 0, 0]];

  //Matriz concatenada (usada para economizar cálculos)
  public concatedMatrix: number[][] = [[0, 0, 0, 0]];

  //Distância máxima da visualização
  public far: number = 1000;

  //Distância minima da visualização
  public near: number = 10;

  public ocultFaces: boolean = true;

  //Sensibilidade de mexer a câmera
  public sensitivity: number = 1;

  //Constrói os valores iniciais da câmera
  constructor(
    position: vec3 = [0, 0, 100],
    target: vec3 = [0, 0, 0],
    viewport: Port,
    windowPort: Port,
    far: number,
    near: number,
    lookAp?: vec3,
    planCenterDistance: number = 1,
    typeCamera: CameraType = 'perspective',
    ocultFaces: boolean = true
  ) {
    this.typeCamera = typeCamera;

    if (
      this.typeCamera === 'perspective' ||
      this.typeCamera === 'axonometric-front'
    ) {
      this.VRP = position;
    } else {
      if (this.typeCamera === 'axonometric-top') {
        this.VRP = [0, 100, 0];
        this.viewUp = [0, 0, 1];
      } else this.VRP = [100, 0, 0];
    }
    this.P = target;

    if (this.typeCamera !== 'axonometric-top')
      this.viewUp = lookAp ?? this.viewUp;

    this.setPlanDistance(planCenterDistance);
    this.ViewPort = viewport;

    this.WindowPort = windowPort;

    this.matrixView = this.getMatrixView();

    this.ocultFaces = ocultFaces ?? true;

    this.far = far;
    this.near = near;
    this.getAllValues();
  }

  //Configura os valores de distância da visualização
  public setDistances(far?: number, near?: number) {
    this.far = far ?? this.far;
    this.near = near ?? this.near;
  }

  //Configura o VRP
  public setVRP(x: number, y: number, z: number) {
    this.VRP = [x, y, z];
    this.getAllValues();
  }

  //Configura o P
  public setP(x: number, y: number, z: number) {
    this.P = [x, y, z];
    this.getAllValues();
  }

  //Configura o VRP e P
  public updateVRP_P(VRP: vec3, P: vec3) {
    this.VRP = VRP;
    this.P = P;

    this.getAllValues();
  }

  public setCameraType(perspective: boolean) {
    if (perspective) this.typeCamera = 'perspective';
    else this.typeCamera = 'axonometric';
    this.getAllValues();
  }

  //Configura a sensibilidade da câmera
  public setSenitivity(sensitivity: number) {
    this.sensitivity = sensitivity;
  }

  //Configura se oculta faces ou não
  public setOcultFaces(ocultFaces: boolean) {
    this.ocultFaces = ocultFaces;
  }

  //Configura o plano de projeção
  public setPlanDistance(distance: number, recalculate?: boolean) {
    this.projectionPlanDistance = distance;
    const { VRP, P, projectionPlanDistance } = this;

    //Recebe os valores de VRP e P
    const [xVRP, yVRP, zVRP] = VRP;
    const [xP, yP, zP] = P;

    //Calcula o plano de projeção (VRP+(P-VRP*distancia))
    this.projectionPlan = [
      xVRP + (xP - xVRP) * (projectionPlanDistance / (zVRP - zP)),
      yVRP + (yP - yVRP) * (projectionPlanDistance / (zVRP - zP)),
      zVRP + (zP - zVRP) * (projectionPlanDistance / (zVRP - zP)),
    ];

    if (recalculate) this.getAllValues();
  }

  //Configura o ViewUp
  public setviewUp(viewUp: vec3) {
    this.viewUp = viewUp;
    this.getAllValues();
  }

  //Configura os valores de window e viewport
  public setWindowSize(windowPort?: Port, viewPort?: Port) {
    this.WindowPort = windowPort ?? this.WindowPort;
    this.ViewPort = viewPort ?? this.ViewPort;

    if (windowPort) {
      this.WindowPort.width = [
        Math.round(windowPort.width[0]),
        Math.round(windowPort.width[1]),
      ];
      this.WindowPort.height = [
        Math.round(windowPort.height[0]),
        Math.round(windowPort.height[1]),
      ];
    }

    if (viewPort) {
      this.ViewPort.width = [
        Math.round(viewPort.width[0]),
        Math.round(viewPort.width[1]),
      ];
      this.ViewPort.height = [
        Math.round(viewPort.height[0]),
        Math.round(viewPort.height[1]),
      ];
    }

    this.matrixView = this.getMatrixView();
    this.concatedMatrix = this.getConcatedMatrix();
  }

  //Calcula os vetores (N,V,U) e já calcula as matrizes SRC e Projeção, com isso concatena
  private getAllValues(): void {
    // this.setPlanDistance(this.projectionPlanDistance * 100);
    this.N = this.getN();
    this.V = this.getV();
    this.U = this.getU();
    this.matrixSRUSRC = this.convertToSRC();
    this.matrixProjection = this.getProjectionMatrix();
    this.concatedMatrix = this.getConcatedMatrix();
  }

  //Calcula o vetor N
  private getN(): vec3 {
    const { VRP, P } = this;

    const PVector = new p5(...P);
    const VRPVector = new p5(...VRP);
    //VRP - P = N (normal)
    return VRPVector.sub(PVector).normalize().array() as vec3;
  }

  //Calcula o vetor V
  private getV(): vec3 {
    const { N, viewUp } = this;

    const YVector = new p5(...viewUp);
    const NVector = new p5(...N);

    const scalar = YVector.dot(NVector);
    //Y - (Y . N) * N = V (normal)
    return p5.sub(YVector, NVector.mult(scalar)).normalize().array() as vec3;
  }

  //Calcula o vetor U
  private getU(): vec3 {
    const { V, N } = this;

    const NVector = new p5(...N);
    const VVector = new p5(...V);
    //(V X N) = U (normal)
    return VVector.cross(NVector).normalize().array() as vec3;
  }

  //Calcula a matriz SRC
  convertToSRC(): number[][] {
    const { VRP, N, U, V } = this;
    //VRP negativo
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

  //Calcula a matriz de projeção
  getProjectionMatrix(): number[][] {
    //Caso seja perspectiva
    if (this.typeCamera === 'perspective') {
      const { VRP, projectionPlan } = this;

      const VRPVector = new p5(...VRP);
      const ProjectionVector = new p5(...projectionPlan);

      //Calcula a distância entre o VRP e o plano de projeção
      const Dp = VRPVector.dist(ProjectionVector);
      const Zvp = -Dp;
      const matrixP = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, -Zvp / Dp, 0],
        [0, 0, -1 / Dp, 0],
      ];
      return matrixP;
      //Se for axonometrica, retorna a matriz identidade
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

  //Calcula a matriz de view
  getMatrixView() {
    const { ViewPort, WindowPort } = this;
    const [xMin, xMax] = WindowPort.width;
    const [yMin, yMax] = WindowPort.height;

    const [uMin, uMax] = ViewPort.width;
    const [vMin, vMax] = ViewPort.height;

    // const matrix = [
    //   [
    //     (uMax - uMin) / (xMax - xMin),
    //     0,
    //     0,
    //     -xMin * ((uMax - uMin) / (xMax - xMin)) + uMin,
    //   ],
    //   [
    //     0,
    //     (vMax - vMin) / (yMax - yMin),
    //     0,
    //     -yMin * ((vMax - vMin) / (yMax - yMin)) + vMin,
    //   ],
    //   [0, 0, 1, 0],
    //   [0, 0, 0, 1],
    // ];
    //A outra matriz de view fica ao contrário no P5
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

  //Calcula a matriz concatenada
  public getConcatedMatrix(): number[][] {
    const { matrixSRUSRC, matrixProjection, matrixView } = this;

    let concatedMatrix = nj.dot(matrixView, matrixProjection).dot(matrixSRUSRC);

    return concatedMatrix.tolist() as number[][];
  }

  //"Anda" a câmera
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
