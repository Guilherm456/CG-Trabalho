import Sketch from 'react-p5';
import p5Types from 'p5';

import { ObjectsProviderContext } from './Provider';

import { VertShader, FragShader } from '../utils/shader';

import { Port } from 'utils/interfaces';

let shaderInf: p5Types.Shader;

enum Direction {
  FRONT = 38,
  BACK = 40,
  LEFT = 37,
  RIGHT = 39,
  DOWN = 16,
  UP = 17,
}

//Define a sensibilidade do movimento da câmera
const sensitivity = 1;

export default function Canva() {
  const { objects, camera, light } = ObjectsProviderContext();

  const setup = (val: any, parentCanvas: Element) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.createCanvas(parent.clientWidth, parent.clientHeight, p5.WEBGL).parent(
      parentCanvas
    );

    const newWindowSize: Port = {
      width: [-(parent.clientWidth / 2), parent.clientWidth / 2],
      height: [-(parent.clientHeight / 2), parent.clientHeight / 2],
    };

    camera.setWindowSize(newWindowSize, newWindowSize);

    shaderInf = p5.createShader(VertShader, FragShader);
    p5.shader(shaderInf);

    // p5.debugMode();
    // p5.noStroke();
    // p5.noFill();
    // p5.camera();
    p5.frameRate(60);
  };

  const draw = (val: any) => {
    const p5 = val as p5Types;

    p5.orbitControl();
    p5.background(54);

    if (p5.keyIsPressed) {
      cameraSystem(p5.keyCode);
    }

    //Vai ficar rotacionando a "luz"
    if (light.rotate) {
      light.rotateLight();
    }
    p5.push();
    p5.translate(light.position[0], light.position[1], light.position[2]);
    p5.stroke(
      light.lightIntensity[0],
      light.lightIntensity[1],
      light.lightIntensity[2]
    );
    p5.sphere(10);
    p5.pop();

    p5.push();
    shaderInf.setUniform('vSRCMatrix', camera.matrixSRUSRC.flat());

    shaderInf.setUniform('vProjectionMatrix', camera.matrixProjection.flat());

    shaderInf.setUniform('vViewMatrix', camera.matrixView.flat());

    objects.forEach((object) => object.drawFaces(p5, camera, shaderInf, light));

    p5.pop();
  };

  const cameraSystem = (key: number) => {
    if (key === Direction.FRONT)
      camera.updatePositionCamera(-sensitivity, 'Z', true);

    if (key === Direction.BACK)
      camera.updatePositionCamera(sensitivity, 'Z', true);

    if (key === Direction.LEFT)
      camera.updatePositionCamera(-sensitivity, 'X', true);

    if (key === Direction.RIGHT)
      camera.updatePositionCamera(sensitivity, 'X', true);

    if (key === Direction.UP)
      camera.updatePositionCamera(sensitivity, 'Y', true);

    if (key === Direction.DOWN)
      camera.updatePositionCamera(-sensitivity, 'Y', true);
    return false;
  };

  const windowResized = (val: any) => {
    const p5 = val as p5Types;
    const parent = document.getElementsByClassName('canvaArea')[0];
    p5.resizeCanvas(parent.clientWidth, parent.clientHeight);
  };

  const mouse = (val: any) => {
    // const p5 = val as p5Types;
    // const diffenceX = p5.winMouseX - p5.pwinMouseX;
    // const diffenceY = p5.winMouseY - p5.pwinMouseY;
    // camera.updatePositionCamera(diffenceY, 'Y', false);
  };

  const debug = (val: any) => {
    const p5 = val as p5Types;
    if (p5.keyCode === 8) {
      console.log(objects);

      console.log(shaderInf);
      console.log('SRU');
      console.log(camera.matrixSRUSRC);
      console.log('Projection');
      console.log(camera.matrixProjection);

      console.log('Camera');
      console.log(`VRP: ${camera.VRP} | P : ${camera.P}`);
    }
  };

  return (
    // @ts-ignore
    <Sketch
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      mouseDragged={mouse}
      keyReleased={debug}
    />
  );
}
