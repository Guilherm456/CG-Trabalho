import p5 from 'p5';
import { useEffect, useRef } from 'react';
import { matrixMul } from 'utils/calculate';
import { vec4 } from 'utils/interfaces';
import { useObjects } from './Provider';

const ZBuffer = ({}) => {
  const { objects, camera } = useObjects();
  const canvas = useRef<HTMLCanvasElement>();

  const width = 750;
  const height = 750;
  const zBuffer = new Array(width)
    .fill(Infinity)
    .map(() => new Array(height).fill(Infinity));

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
        for (let face of object.edges) {
          for (let edge of face) {
            const edgesSRT = matrixMul(edge, camera.concatedMatrix) as vec4;
            const distance = new p5.Vector(...camera.N).dot(
              new p5.Vector(...camera.VRP).sub(
                new p5.Vector(...edgesSRT.slice(0, 3))
              )
            );

            const x = Math.round(edgesSRT[0] * 100);
            const y = Math.round(edgesSRT[1] * 100);

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
            //Plota 4 pixels ao redor do pixel atual
            for (let k = -2; k < 2; k++) {
              for (let l = -2; l < 2; l++) {
                const index = (i + k + (j + l) * width) * 4;
                data[index] = 255;
                data[index + 1] = 255;
                data[index + 2] = 255;
                data[index + 3] = 255;
              }
            }
          }
        }
      }
      data.set(data);

      ctx?.putImageData(imageData, 0, 0);
    }
  };

  const draw = () => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext('webgl', {
      antialias: false,
      depth: false,
    }) as WebGLRenderingContext;

    if (!ctx) return;

    // Descomentar APENAS quando funcionar uma vez
    // Ele vai ficar atualizando a tela a cada 1 segundo
    // setTimeout(draw, 1000);
    // Esse código faz a camera ficar se movendo
    // camera.updatePositionCamera(-camera.sensitivity, 'Z', true);
  };
  useEffect(() => {
    setTimeout(draw2D, 100);
  }, [canvas, camera, objects]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => draw2D()}>Reload</button>
      <canvas
        ref={canvas as any}
        width={width}
        height={height}
        onKeyPress={(e) => {
          e.preventDefault();
          //Clicou seta para esquerda
          // if(e.key ===
          // camera.updatePositionCamera(10,'X')
        }}
        onClick={() => {
          camera.updatePositionCamera(-camera.sensitivity, 'Z', true);
        }}
      />
    </div>
  );
};

export default ZBuffer;
