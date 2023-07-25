import p5 from 'p5';
import { useEffect, useRef } from 'react';
import { matrixMul } from 'utils/calculate';
import { vec3, vec4 } from 'utils/interfaces';
import { useObjects } from './Provider';

const ZBuffer = ({}) => {
  const { objects, camera } = useObjects();
  const canvas = useRef<HTMLCanvasElement>();

  const width =
    Math.abs(camera.ViewPort.width[0]) + Math.abs(camera.ViewPort.width[1]);
  const height =
    Math.abs(camera.ViewPort.height[0]) + Math.abs(camera.ViewPort.height[1]);

  const zBuffer = new Array(width)
    .fill(Infinity)
    .map(() => new Array(height).fill(Infinity));

  const objetsSRT = objects.map((object) => {
    object.faces.map((face) =>
      face.map((vertex) => {
        const vertexSRT = matrixMul(vertex, camera.concatedMatrix) as vec4;
        const x = Math.round(vertexSRT[0] * 10);
        const y = Math.round(vertexSRT[1] * 10);
        return [x, y, vertex[2]] as vec3;
      })
    );
  });

  function fillPolygon(vertices: any[]) {
    const minY = Math.min(...vertices.map(([x, y]) => y));
    const maxY = Math.max(...vertices.map(([x, y]) => y));

    for (let y = minY; y <= maxY; y++) {
      const intersections: number[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const [x1, y1] = vertices[i];
        const [x2, y2] = vertices[(i + 1) % vertices.length];

        if ((y1 <= y && y2 > y) || (y1 > y && y2 <= y)) {
          const x = Math.round(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
          intersections.push(x);
        }
      }

      intersections.sort((a, b) => a - b);

      for (let i = 0; i < intersections.length; i += 2) {
        const startX = intersections[i];
        const endX = intersections[i + 1];

        for (let x = startX; x <= endX; x++) {
          if (x >= width || y >= height || x < 0 || y < 0) continue;
          zBuffer[x][y] = 255;
        }
      }
    }
  }

  const draw2D = () => {
    if (!canvas.current) return;

    zBuffer.forEach((line) => line.fill(Infinity));
    const ctx = canvas.current.getContext('2d', {});

    // ctx?.fillStyle = 'red';
    ctx?.fillRect(0, 0, width, height);

    // const a = ctx?.createImageData(500, 500);
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
            })
          );
          for (let edge of face) {
            const edgesSRT = matrixMul(edge, camera.concatedMatrix) as vec4;
            const distance = new p5.Vector(...camera.N).dot(
              new p5.Vector(...camera.VRP).sub(
                new p5.Vector(...edgesSRT.slice(0, 3))
              )
            );

            const x = Math.round(edgesSRT[0] - camera.ViewPort.width[0]);
            const y = Math.round(edgesSRT[1] - camera.ViewPort.height[0]);

            if (x >= width || y >= height || x < 0 || y < 0) continue;

            if (distance < zBuffer[x][y]) {
              zBuffer[x][y] = distance;
            }
          }
        }
      }

      for (let i = 0; i < zBuffer.length; i++) {
        for (let j = 0; j < zBuffer[0].length; j++) {
          if (zBuffer[i][j] !== Infinity) {
            const index = (j * width + i) * 4;
            data[index] = 255;
            data[index + 1] = 255;
            data[index + 2] = 255;
            data[index + 3] = 255;
          }
        }
      }
      data.set(data);

      ctx?.putImageData(imageData, 0, 0);
    }
  };

  const click = (e: MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

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
          console.debug('achou', object.typeLetter);
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

  useEffect(() => {
    setTimeout(draw2D, 100);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, camera, objects]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => draw2D()}>Reload</button>
      <canvas
        ref={canvas as any}
        width={width}
        height={height}
        onClick={(e) => click(e as any)}
      />
    </div>
  );
};

export default ZBuffer;
