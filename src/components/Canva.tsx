import p5Types from 'p5';
import Sketch from 'react-p5';
import { useObjects } from './Provider';

import { FragShader, VertShader } from '../utils/shader';

import { Dispatch, FC, SetStateAction, useMemo } from 'react';

let shaderInf: p5Types.Shader;

//Teclas de controle
enum Direction {
  FRONT = 38, //Seta para cima
  BACK = 40, //Seta para baixo
  LEFT = 37, //Seta para esquerda
  RIGHT = 39, //Seta para direita
  DOWN = 16, //Shift
  UP = 17, //Ctrl
}

type Props = {
  selectedLetter: string[];
  setSelectedLetter: Dispatch<SetStateAction<string[]>>;
  indexCamera: number;
};
export const Canva: FC<Props> = ({ selectedLetter, indexCamera }) => {
  const { objects, cameras, light } = useObjects();
  const camera = cameras[indexCamera];

  const width =
    Math.abs(camera.ViewPort.width[0]) + Math.abs(camera.ViewPort.width[1]);
  const height =
    Math.abs(camera.ViewPort.height[0]) + Math.abs(camera.ViewPort.height[1]);

  const setup = (val: any, parentCanvas: Element) => {
    const p5 = val as p5Types;
    p5.createCanvas(width, height, p5.WEBGL).parent(parentCanvas);

    //Define o shader
    shaderInf = p5.createShader(VertShader, FragShader);
    p5.shader(shaderInf);

    p5.frameRate(15);
    p5.noStroke();
    p5.noFill();
  };

  const draw = (val: any) => {
    const p5 = val as p5Types;

    p5.background(0);

    p5.push();
    objects.forEach((object) =>
      object.draw(
        p5,
        camera,
        shaderInf,
        light,
        selectedLetter.includes(object.id)
      )
    );
    p5.pop();
  };

  const cameraSystem = (key: number) => {
    if (key === Direction.FRONT)
      camera.updatePositionCamera(-camera.sensitivity, 'Z', true);

    if (key === Direction.BACK)
      camera.updatePositionCamera(camera.sensitivity, 'Z', true);

    if (key === Direction.LEFT)
      camera.updatePositionCamera(-camera.sensitivity, 'X', true);

    if (key === Direction.RIGHT)
      camera.updatePositionCamera(camera.sensitivity, 'X', true);

    if (key === Direction.UP)
      camera.updatePositionCamera(camera.sensitivity, 'Y', true);

    if (key === Direction.DOWN)
      camera.updatePositionCamera(-camera.sensitivity, 'Y', true);
    return false;
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
      console.log(camera);
    }
  };

  const memo = useMemo(() => {
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1,
            color: 'white',
            userSelect: 'none',
          }}
        ></span>
        <Sketch setup={setup} draw={draw} keyReleased={debug} />
      </div>
    );
  }, [objects, cameras, light, draw, setup, debug]);

  return <>{memo}</>;
};
