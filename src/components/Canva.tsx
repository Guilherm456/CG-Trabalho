import p5Types from 'p5';
import Sketch from 'react-p5';
import { useObjects } from './Provider';

import { FragShader, VertShader } from '../utils/shader';

import { useEffect, useMemo, useState } from 'react';
import { matrixMul } from 'utils/calculate';
import { Port } from 'utils/interfaces';
import { clamp } from 'utils/others';

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
  indexCamera: number;
};
export default function Canva({ indexCamera }: Props) {
  const { objects, light, camera, handleEditCamera } = useObjects();
  const [clickedLetter, setClickedLetter] = useState('');

  const cameraActual = camera[indexCamera];
  const objectsActual = objects;

  useEffect(() => {
    objectsActual.forEach((object) => {
      object.calculatePoints(cameraActual.concatedMatrix);
    });
  }, [camera]);

  const memo = useMemo(() => {
    const setup = (val: any, parentCanvas: Element) => {
      const p5 = val as p5Types;
      const parent = document.getElementsByClassName('canvaArea')[0];
      p5.createCanvas(
        parent.clientWidth / 2,
        parent.clientHeight / 2,
        p5.WEBGL
      ).parent(parentCanvas);

      const newWindowSize: Port = {
        width: [-(parent.clientWidth / 4), parent.clientWidth / 4],
        height: [-(parent.clientHeight / 4), parent.clientHeight / 4],
      };

      cameraActual.setWindowSize(newWindowSize, newWindowSize);

      //Define o shader
      shaderInf = p5.createShader(VertShader, FragShader);
      p5.shader(shaderInf);

      p5.frameRate(30);
      p5.noStroke();

      cameraActual.setP5(p5);
    };
    const draw = (val: any) => {
      const p5 = val as p5Types;

      p5.background(0);

      //Para "debugar"
      if (p5.keyIsPressed) {
        cameraSystem(p5.keyCode);
      }

      //Vai ficar rotacionando a "luz"
      if (light.rotate) {
        light.rotateLight();
      }

      p5.push();
      objectsActual.forEach((object) => object.draw(p5, cameraActual));
      p5.pop();

      p5.push();
      const [xL, yL] = matrixMul(
        light.position,
        cameraActual.concatedMatrix
      ) as number[];

      p5.translate(xL, yL, light.position[2]);
      p5.stroke(
        light.lightIntensity[0],
        light.lightIntensity[1],
        light.lightIntensity[2]
      );
      p5.sphere(10);
      p5.pop();

      drawGizmo(p5);
    };

    const drawGizmo = (val: any) => {
      const p5 = val as p5Types;
      p5.push();
      const arrowSize = 100;
      const pos = -p5.width / 5;

      p5.translate(pos, pos);
      const x = clamp(
        cameraActual.VRP[0] - cameraActual.projectionPlan[0],
        -arrowSize,
        arrowSize
      );
      const y = clamp(
        -(cameraActual.VRP[1] - cameraActual.projectionPlan[1]),
        -arrowSize,
        arrowSize
      );
      const z = clamp(
        cameraActual.VRP[2] - cameraActual.projectionPlan[2],
        -arrowSize,
        arrowSize
      );

      p5.strokeWeight(2);
      p5.stroke(255, 0, 0);
      p5.line(0, 0, 0, x, 0, 0);
      p5.stroke(0, 255, 0);
      p5.line(0, 0, 0, 0, y, 0);
      p5.stroke(0, 0, 255);
      p5.line(0, 0, 0, 0, 0, z);

      p5.pop();
    };

    const cameraSystem = (key: number) => {
      if (key === Direction.FRONT)
        cameraActual.updatePositionCamera(-cameraActual.sensitivity, 'Z', true);

      if (key === Direction.BACK)
        cameraActual.updatePositionCamera(cameraActual.sensitivity, 'Z', true);

      if (key === Direction.LEFT)
        cameraActual.updatePositionCamera(-cameraActual.sensitivity, 'X', true);

      if (key === Direction.RIGHT)
        cameraActual.updatePositionCamera(cameraActual.sensitivity, 'X', true);

      if (key === Direction.UP)
        cameraActual.updatePositionCamera(cameraActual.sensitivity, 'Y', true);

      if (key === Direction.DOWN)
        cameraActual.updatePositionCamera(-cameraActual.sensitivity, 'Y', true);
      handleEditCamera(cameraActual);
      return false;
    };

    const windowResized = (val: any) => {
      const p5 = val as p5Types;
      const parent = document.getElementsByClassName('canvaArea')[0];
      p5.resizeCanvas(parent.clientWidth, parent.clientHeight);
    };

    const debug = (val: any) => {
      const p5 = val as p5Types;
      if (p5.keyCode === 8) {
        console.log(objects);

        console.log(shaderInf);
        console.log('SRU');
        console.log(cameraActual.matrixSRUSRC);
        console.log('Projection');
        console.log(cameraActual.matrixProjection);

        console.log('Camera');
        console.log(camera);
      }
    };

    const onMouseClick = (val: any) => {
      const p5 = val as p5Types;
      const x = p5.mouseX;
      const y = p5.mouseY;

      if (x < 0 || x > p5.width || y < 0 || y > p5.height) return;

      const {
        width: [left, right],
        height: [bottom, top],
      } = cameraActual.WindowPort;

      const xCam = p5.map(x, 0, p5.width, left, right);
      const yCam = p5.map(y, 0, p5.height, bottom, top);

      console.debug('Clicou em', xCam, yCam);
      objectsActual.forEach((object) => {
        object.edges.forEach((edge) => {
          for (let vertice of edge) {
            if (vertice[0] === xCam && vertice[1] === yCam) {
              console.debug('Clicou no vertice', vertice);
            }
          }
        });
      });
    };
    return (
      // @ts-ignore
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        keyReleased={debug}
        mouseClicked={onMouseClick}
      />
    );
  }, [light, objectsActual, cameraActual, objects, camera]);

  return <>{memo}</>;
}
