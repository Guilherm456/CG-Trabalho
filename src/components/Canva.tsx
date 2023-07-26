import p5Types from 'p5';
import Sketch from 'react-p5';
import { useObjects } from './Provider';

import { FragShader, VertShader } from '../utils/shader';

import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { matrixMul } from 'utils/calculate';
import { Port, vec3 } from 'utils/interfaces';
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
  selectedLetter: string[];
  setSelectedLetter: Dispatch<SetStateAction<string[]>>;
};
export const Canva: FC<Props> = ({ selectedLetter, setSelectedLetter }) => {
  const { objects, cameras, light } = useObjects();

  const camera = cameras[3];
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

    //Para "debugar"
    if (p5.keyIsPressed) {
      cameraSystem(p5.keyCode);
    }

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

    p5.push();
    const [xL, yL] = matrixMul(
      light.position,
      camera.concatedMatrix
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
      camera.VRP[0] - camera.projectionPlan[0],
      -arrowSize,
      arrowSize
    );
    const y = clamp(
      -(camera.VRP[1] - camera.projectionPlan[1]),
      -arrowSize,
      arrowSize
    );
    const z = clamp(
      camera.VRP[2] - camera.projectionPlan[2],
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
      console.log(camera.matrixSRUSRC);
      console.log('Projection');
      console.log(camera.matrixProjection);

      console.log('Camera');
      console.log(camera);
    }
  };

  const click = (val: any) => {
    const p5 = val as p5Types;
    const mouseX = p5.mouseX;
    const mouseY = p5.mouseY;

    const transformedMouse = matrixMul(
      [
        mouseX + camera.ViewPort.width[0],
        mouseY + camera.ViewPort.height[0],
        0,
      ], // Assume-se que o mouse está na posição Z = 0 na cena
      camera.concatedMatrix
    ) as vec3;

    for (let object of objects) {
      for (let face of object.faces) {
        if (isPointInsidePolygon(transformedMouse, face)) {
          // setSelectedLetter(object.id);
        }
      }
    }
  };

  function isPointInsidePolygon(point: vec3, vertices: vec3[]): boolean {
    let isInside = false;

    const facesSRT = vertices.map((vertex) => {
      const vertexSRT = matrixMul(vertex, camera.concatedMatrix) as vec3;
      return vertexSRT;
    });

    const maxY = Math.max(...facesSRT.map((vertex) => vertex[1]));
    const minY = Math.min(...facesSRT.map((vertex) => vertex[1]));
    const maxX = Math.max(...facesSRT.map((vertex) => vertex[0]));
    const minX = Math.min(...facesSRT.map((vertex) => vertex[0]));

    if (
      minY <= point[1] &&
      point[1] <= maxY &&
      minX <= point[0] &&
      point[0] <= maxX
    ) {
      const indexHoles = vertices.findIndex(
        ([x, y, z], index) =>
          z === vertices[0][2] &&
          x === vertices[0][0] &&
          y === vertices[0][1] &&
          index !== 0
      );

      if (indexHoles && indexHoles + 1 < vertices.length) {
        let index = indexHoles + 1;
        while (true) {
          const [xI, yI, zI] = vertices[index];
          let minX = Infinity;
          let maxX = -Infinity;
          let minY = Infinity;
          let maxY = -Infinity;
          for (let i = index; i < vertices.length; i++) {
            const [x, y, z] = vertices[i];

            if (x === xI && y === yI && z === zI && i !== indexHoles) {
              index = i + 1;
              break;
            }

            if (x < minX) minX = x;
            else if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            else if (y > maxY) maxY = y;
          }

          if (
            minY <= point[1] &&
            point[1] <= maxY &&
            minX <= point[0] &&
            point[0] <= maxX
          ) {
            isInside = !isInside;
            break;
          }

          if (index === vertices.length) break;
        }
      } else isInside = !isInside;
    }

    return isInside;
  }

  const memo = useMemo(() => {
    return (
      // @ts-ignore
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        mouseClicked={click}
        keyReleased={debug}
      />
    );
  }, [objects, camera, light, draw, setup, windowResized, debug, click]);

  return <>{memo}</>;
};
