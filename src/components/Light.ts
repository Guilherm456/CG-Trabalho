import { vec3, vec4 } from 'utils/interfaces';

import { rotate } from 'utils/calculate';

export class Light {
  //Posição
  public position: vec4;

  //Intensidade da luz ambiente
  public ambientLightIntensity: vec3;

  //Intensidade da luz
  public lightIntensity: vec3;

  //Se deve rotacionar ou não
  public rotate: boolean = true;
  //Angulo de rotação
  public angle: number = 1;
  //Direção
  public direction: 'X' | 'Y' | 'Z' = 'Y';

  public lightType: 0 | 1 | 2 = 0;

  //Constrói os valores iniciais da luz
  constructor(position: vec3, Ila: vec3, Ia: vec3) {
    this.position = [...position, 1];

    this.ambientLightIntensity = Ila;
    this.lightIntensity = Ia;
  }

  //Configura os de itensidade da luz (Ila = Ambiente, Ia = Luz)
  setIntensity(Ila?: vec3, Ia?: vec3) {
    this.ambientLightIntensity = Ila ?? this.ambientLightIntensity;
    this.lightIntensity = Ia ?? this.lightIntensity;
  }

  //Configura a posição da luz
  setPosition(position: vec3) {
    this.position = [...position, 1];
  }

  setType(type: 0 | 1 | 2) {
    this.lightType = type;
  }

  //Configura se deve rotacionar ou seus valores
  setRotate(rotate: boolean, angle?: number, direction?: 'X' | 'Y' | 'Z') {
    this.rotate = rotate;
    this.angle = angle ?? this.angle;
    this.direction = direction ?? this.direction;
  }

  //Rotaciona a luz a cada frame
  rotateLight() {
    this.position = rotate(this.position, this.angle, this.direction) as vec4;
  }
}
