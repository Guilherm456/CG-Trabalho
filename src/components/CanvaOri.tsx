import p5Types from 'p5';
import Sketch from 'react-p5';

export const CanvaOriginal = () => {
  const Z = 5;
  const positions = [
    // [
    //   [-2.5, 3.5],
    //   [-2.5, -3.5],
    //   [2.5, -3.5],
    //   [2.5, -2.5],
    //   [-1.5, -2.5],
    //   [-1.5, 3.5],
    // ],
    // [
    //   [-2.5, 3.5],
    //   [2.5, 3.5],
    //   [2.5, -3.5],
    //   [1.5, -3.5],
    //   [1.5, -0.5],
    //   [-1.5, -0.5],
    //   [-1.5, -3.5],
    //   [-2.5, -3.5],
    //   [-2.5, 3.5],
    // ],
    // [
    //   [-1.5, 2.5],
    //   [1.5, 2.5],
    //   [1.5, 0.5],
    //   [-1.5, 0.5],
    //   [-1.5, 2.5],
    // ],
  ];

  const draw = (val: any) => {
    const p5 = val as p5Types;
    p5.background(0);
    p5.orbitControl();

    p5.push();
    p5.translate(0, 0, 0);

    p5.stroke(255);
    const amplificador = 10;
    p5.beginShape(p5.LINES);
    positions.forEach((positionSet) => {
      const partFaces = [];

      positionSet.forEach((position, i) => {
        const [x1, y1] = position.map((coord) => -coord * amplificador);
        const z1 = 0;
        const z2 = Z * amplificador;

        p5.vertex(x1, y1, z1);
        p5.vertex(x1, y1, z2);

        const nextIndex = (i + 1) % positionSet.length;
        const [x3, y3] = positionSet[nextIndex].map(
          (coord) => -coord * amplificador
        );
        const z3 = 0;
        const z4 = Z * amplificador;

        p5.vertex(x1, y1, z1);
        p5.vertex(x3, y3, z3);
        p5.vertex(x1, y1, z2);
        p5.vertex(x3, y3, z4);

        partFaces.push([x1, y1, z1, x1, y1, z2, x3, y3, z3, x3, y3, z4]);
      });
      // console.debug('partFaces', partFaces);
    });

    p5.endShape();

    p5.pop();
  };

  const setup = (val: any, parentCanvas: Element) => {
    const p5 = val as p5Types;

    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.createCanvas(parent.clientWidth, parent.clientHeight, p5.WEBGL).parent(
      parentCanvas
    );

    p5.frameRate(30);
    p5.noStroke();
    p5.noFill();
    // p5.debugMode();
  };

  //@ts-ignore
  return <Sketch draw={draw} setup={setup} />;
};
