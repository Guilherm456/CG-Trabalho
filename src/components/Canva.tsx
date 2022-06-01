import Sketch from 'react-p5';
import p5Types from 'p5';

import { ObjectsProviderContext } from './Provider';

export default function Canva() {
  const { objects } = ObjectsProviderContext();
  const setup = (val: any, parentCanvas: Element) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.createCanvas(parent.clientWidth, parent.clientHeight, p5.WEBGL).parent(
      parentCanvas
    );
    p5.noFill();
    p5.debugMode();
    p5.camera();
    p5.frameRate(60);
  };

  const draw = (val: any) => {
    const p5 = val as p5Types;
    p5.background(54);
    p5.strokeWeight(1);
    p5.orbitControl();

    objects.forEach((object) => object.drawSphere(p5));
  };

  const windowResized = (val: any) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.resizeCanvas(parent.clientWidth, parent.clientHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}
