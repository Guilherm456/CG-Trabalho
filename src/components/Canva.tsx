import Sketch from 'react-p5';
import p5Types from 'p5';

export default function Canva() {
  const setup = (val: any, parentCanvas: Element) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.createCanvas(parent.clientWidth, parent.clientHeight).parent(
      parentCanvas
    );
  };

  const draw = (val: any) => {
    const p5 = val as p5Types;
    p5.background(51);
  };

  const windowResized = (val: any) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.resizeCanvas(parent.clientWidth, parent.clientHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}
