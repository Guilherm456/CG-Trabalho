import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { matrixMul } from 'utils/calculate';
import { vec3, vec4 } from 'utils/interfaces';
import { useObjects } from './Provider';

interface Props {
  indexCamera: number;
  selectedLetter: string[];
  setSelectedLetter: Dispatch<SetStateAction<string[]>>;
  lastPosition: number[];
  setLastPosition: Dispatch<SetStateAction<number[]>>;
}
const ZBuffer: FC<Props> = ({
  indexCamera,
  selectedLetter,
  setSelectedLetter,
  lastPosition,
  setLastPosition,
}) => {
  const { objects, cameras } = useObjects();

  const canvas = useRef<HTMLCanvasElement>();

  const camera = cameras[indexCamera];

  const width =
    Math.abs(camera.ViewPort.width[0]) + Math.abs(camera.ViewPort.width[1]);
  const height =
    Math.abs(camera.ViewPort.height[0]) + Math.abs(camera.ViewPort.height[1]);

  const zBuffer = new Array(width)
    .fill([0, 0, 0])
    .map(() => new Array(height).fill([0, 0, 0]));
  const zDepth = new Array(width).fill(Infinity).map(() => new Array(height));

  const objetsSRT = objects.map((object) => {
    object.faces.map((face) => {
      face.map((vertex) => {
        const vertexSRT = matrixMul(vertex, camera.concatedMatrix) as vec4;
        const x = Math.round(vertexSRT[0] - camera.ViewPort.width[0]);
        const y = Math.round(vertexSRT[1] - camera.ViewPort.height[0]);
        return [x, y, vertex[2]] as vec3;
      });
      return face;
    });
    return object;
  });

  function fillPolygon(vertices: vec3[], selected: boolean = false) {
    const minY = Math.min(...vertices.map(([x, y]) => y));
    const maxY = Math.max(...vertices.map(([x, y]) => y));

    for (let y = minY; y <= maxY; y++) {
      const intersections: number[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const [x1, y1] = vertices[i];
        const [x2, y2] = vertices[(i + 1) % vertices.length];

        if ((y1 <= y && y2 > y) || (y1 > y && y2 <= y)) {
          const m = (y2 - y1) / (x2 - x1);
          const x = x1 + (y - y1) / m;

          intersections.push(x);
        }
      }

      intersections.sort((a, b) => a - b);

      for (let i = 0; i < intersections.length; i += 2) {
        const startX = intersections[i];
        const endX = intersections[i + 1];

        for (let x = startX; x <= endX; x++) {
          if (x >= width || y >= height || x < 0 || y < 0) continue;

          if (selected) {
            zBuffer[x][y] = [200, 0, 0];
          } else {
            zBuffer[x][y] = [200, 200, 200];
          }

          zDepth[x][y] = 255;
        }
      }
    }
  }

  const draw2D = () => {
    if (!canvas.current) return;

    zBuffer.forEach((line) => line.fill([0, 0, 0]));
    const ctx = canvas.current.getContext('2d', {});

    ctx?.fillRect(0, 0, width, height);

    const imageData = ctx?.getImageData(0, 0, width, height);
    const data = imageData?.data;

    if (data) {
      for (let object of objects) {
        for (let face of object.faces) {
          fillPolygon(
            face.map((vertex) => {
              const vertexSRT = matrixMul(
                vertex,
                camera.concatedMatrix
              ) as vec4;
              const x = Math.round(vertexSRT[0] - camera.ViewPort.width[0]);
              const y = Math.round(vertexSRT[1] - camera.ViewPort.height[0]);
              return [x, y, vertex[2]] as vec3;
            }),
            selectedLetter.includes(object.id)
          );
        }
      }

      for (let i = 0; i < zBuffer.length; i++) {
        for (let j = 0; j < zBuffer[0].length; j++) {
          const index = (j * width + i) * 4;
          const [R, G, B] = zBuffer[i][j];
          data[index] = R;
          data[index + 1] = G;
          data[index + 2] = B;
        }
      }
      data.set(data);

      ctx?.putImageData(imageData, 0, 0);
    }
  };

  const getMouseX = (mouseX: number) => {
    switch (camera.typeCamera) {
      case 'axonometric-front':
        return mouseX + camera.ViewPort.width[0];
      case 'axonometric-side':
        return mouseX + camera.ViewPort.width[0];
      case 'axonometric-top':
        return -(mouseX + camera.ViewPort.width[0]);
      case 'perspective':
        return mouseX + camera.ViewPort.width[0];
    }
  };

  const click = (e: MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setLastPosition([mouseX, mouseY]);

    const transformedMouse = matrixMul(
      [getMouseX(mouseX), mouseY + camera.ViewPort.height[0], 0], // Assume-se que o mouse está na posição Z = 0 na cena
      camera.concatedMatrix
    ) as vec3;

    for (let object of objects) {
      for (let face of object.faces) {
        if (isPointInsidePolygon(transformedMouse, face)) {
          if (selectedLetter.includes(object.id)) {
            setSelectedLetter(
              selectedLetter.filter((letter) => letter !== object.id)
            );
          } else {
            setSelectedLetter([...selectedLetter, object.id]);
          }
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

  const mouseDragged = (e: any) => {
    if (e && e.buttons) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const selectedObject = objects.filter((object) =>
        selectedLetter.includes(object.id)
      );

      if (selectedObject.length > 0)
        selectedObject.forEach((object) => {
          switch (camera.typeCamera) {
            case 'axonometric-front':
              object.translate(
                -(lastPosition[0] - mouseX),
                lastPosition[1] - mouseY,
                0
              );
              break;
            case 'axonometric-side':
              object.translate(
                0,
                lastPosition[1] - mouseY,
                lastPosition[0] - mouseX
              );
              break;
            case 'axonometric-top':
              object.translate(
                lastPosition[0] - mouseX,
                0,
                lastPosition[1] - mouseY
              );
              break;
            case 'perspective':
              object.translate(
                -(lastPosition[0] - mouseX),
                lastPosition[1] - mouseY,
                0
              );
              break;
          }
        });

      setLastPosition([mouseX, mouseY]);
    }
  };

  useEffect(() => {
    setTimeout(draw2D, 100);
  }, [canvas, camera, objects, draw2D, lastPosition]);

  return (
    <canvas
      ref={canvas as any}
      width={width}
      height={height}
      onClick={(e) => click(e as any)}
      onMouseMove={(e) => mouseDragged(e)}
    />
  );
};

export default ZBuffer;
