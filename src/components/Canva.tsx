import Sketch from 'react-p5';
import p5Types from 'p5';

import { ObjectsProviderContext } from './Provider';

import { VertShader, FragShader } from '../utils/shader';

let shaderInf: p5Types.Shader;

export default function Canva() {
  const { objects } = ObjectsProviderContext();

  const setup = (val: any, parentCanvas: Element) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.createCanvas(parent.clientWidth, parent.clientHeight, p5.WEBGL).parent(
      parentCanvas
    );
    shaderInf = p5.createShader(VertShader, FragShader);
    p5.shader(shaderInf);

    p5.debugMode();
    p5.noStroke();
    p5.camera();
    p5.frameRate(60);
  };

  const draw = (val: any) => {
    const p5 = val as p5Types;

    p5.background(54);

    p5.orbitControl();

    p5.push();
    shaderInf.setUniform('uColor', [1, 0, 0]);
    shaderInf.setUniform('uScreenSize', [p5.width, p5.height]);

    objects.forEach((object) => object.drawSphere(p5));

    p5.pop();
  };

  const windowResized = (val: any) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.resizeCanvas(parent.clientWidth, parent.clientHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}
