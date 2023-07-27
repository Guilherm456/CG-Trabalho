import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { matrixMul } from 'utils/calculate';
import { vec3, vec4 } from 'utils/interfaces';
import { Letter } from './Letter';
import { useObjects } from './Provider';
import { click, mouseDragged } from 'utils/mouse';

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
  const { objects, cameras, light } = useObjects();

  const canvas = useRef<HTMLCanvasElement>();

  const camera = cameras[indexCamera];

  const width =
    Math.abs(camera.ViewPort.width[0]) + Math.abs(camera.ViewPort.width[1]);
  const height =
    Math.abs(camera.ViewPort.height[0]) + Math.abs(camera.ViewPort.height[1]);

  const zBuffer = useMemo(
    () =>
      new Array(width)
        .fill([0, 0, 0])
        .map(() => new Array(height).fill([0, 0, 0])),
    [width, height]
  );
  const zDepth = useMemo(
    () => new Array(width).fill(Infinity).map(() => new Array(height)),
    [width, height]
  );

  // const objetsSRT = objects.map((object) => {
  //   object.faces.map((face) => {
  //     face.map((vertex) => {
  //       const vertexSRT = matrixMul(vertex, camera.concatedMatrix) as vec4;
  //       const x = Math.round(vertexSRT[0] - camera.ViewPort.width[0]);
  //       const y = Math.round(vertexSRT[1] - camera.ViewPort.height[0]);
  //       return [x, y, vertex[2]] as vec3;
  //     });
  //     return face;
  //   });
  //   return object;
  // });

  function fillPolygon(
    vertices: vec3[],
    selected: boolean = false,
    letter: Letter,
    indexFace: number
  ) {
    const minY = Math.min(...vertices.map(([x, y, z]) => y));
    const maxY = Math.max(...vertices.map(([x, y, z]) => y));

    for (let y = minY; y <= maxY; y++) {
      const intersections: { x: number; z: number }[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const [x1, y1, z1] = vertices[i];
        const [x2, y2, z2] = vertices[(i + 1) % vertices.length];

        if ((y1 <= y && y2 > y) || (y1 > y && y2 <= y)) {
          const t = (y - y1) / (y2 - y1);
          const x = x1 + t * (x2 - x1);
          const z = z1 + t * (z2 - z1);

          intersections.push({ x: Math.round(x), z });
        }
      }

      intersections.sort((a, b) => a.x - b.x);

      for (let i = 0; i < intersections.length; i += 2) {
        const start = intersections[i];
        const end = intersections[i + 1];

        for (let x = start.x; x <= end.x; x++) {
          if (x >= width || y >= height || x < 0 || y < 0) break;

          const t = (x - start.x) / (end.x - start.x);
          const z = camera.VRP[2] - (start.z + t * (end.z - start.z));

          if (zDepth[x][y] > z) {
            if (selected) {
              zBuffer[x][y] = [200, 0, 0, z];
            } else {
              zBuffer[x][y] = letter.calculateFlatShading(
                light,
                camera,
                indexFace
              );
            }

            zDepth[x][y] = z;
          }
        }
      }
    }
  }

  const draw2D = useCallback(() => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext('2d', {});
    ctx?.fillRect(0, 0, width, height);
    zBuffer.forEach((line) => line.fill([0, 0, 0]));
    zDepth.forEach((line) => line.fill(Infinity));
    const imageData = ctx?.getImageData(0, 0, width, height);
    const data = imageData?.data;

    objects.sort((a, b) => {
      return a.center[2] - b.center[2];
    });

    if (data) {
      objects.forEach((object) => {
        for (let i = 0; i < object.faces.length; i++) {
          const face = object.faces[i];
          if (object.isFaceVisible(camera, i))
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
              selectedLetter.includes(object.id),
              object,
              i
            );
        }
      });

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
  }, [canvas, camera, objects, fillPolygon, lastPosition]);

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

  const onClick = (e: MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setLastPosition([mouseX, mouseY]);

    click(mouseX, mouseY, objects, camera, selectedLetter, setSelectedLetter);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (e && e.buttons) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      mouseDragged(
        mouseX,
        mouseY,
        e.metaKey,
        e.shiftKey,
        lastPosition,
        objects,
        selectedLetter,
        setLastPosition,
        camera.typeCamera
      );
    }
  };

  useEffect(() => {
    setTimeout(draw2D, 25);
  }, [canvas, cameras, objects, selectedLetter, lastPosition, light]);

  const Canvas = useMemo(
    () => (
      <canvas
        ref={canvas as any}
        width={width}
        height={height}
        onClick={(e) => onClick(e as any)}
        onMouseMove={(e) => onMouseMove(e as any)}
      />
    ),
    [
      cameras,
      objects,
      selectedLetter,
      lastPosition,
      light,
      canvas,
      width,
      height,
    ]
  );
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
      >
        {camera.typeCamera}
      </span>
      {Canvas}
    </div>
  );
};

export default ZBuffer;
