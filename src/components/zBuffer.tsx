import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { matrixMul } from 'utils/calculate';
import { vec3, vec4 } from 'utils/interfaces';
import { click, mouseDragged } from 'utils/mouse';
import { Letter } from './Letter';
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
  const { objects, cameras, light, handleChangeLight } = useObjects();

  const canvas = useRef<HTMLCanvasElement>();

  const camera = cameras[indexCamera];

  const width =
    Math.abs(camera.ViewPort.width[0]) + Math.abs(camera.ViewPort.width[1]);
  const height =
    Math.abs(camera.ViewPort.height[0]) + Math.abs(camera.ViewPort.height[1]);

  const zBuffer = useMemo(
    () =>
      new Array(width).fill(null).map(() => new Array(height).fill([0, 0, 0])),
    [width, height]
  );
  const zDepth = useMemo(
    () => new Array(width).fill(Infinity).map(() => new Array(height)),
    [width, height]
  );

  let fillPolygons = indexCamera === 3;

  function fillPolygon(
    vertices: vec3[],
    selected: boolean = false,
    letter: Letter,
    indexFace: number
  ) {
    const minY = Math.min(...vertices.map(([_, y]) => y));
    const maxY = Math.max(...vertices.map(([_, y]) => y));

    for (let y = minY; y <= maxY; y++) {
      const intersections: { x: number; z: number }[] = [];

      // let firstHole = vertices[0];
      for (let i = 0; i < vertices.length; i++) {
        const [x1, y1, z1] = vertices[i];
        const [x2, y2, z2] = vertices[(i + 1) % vertices.length];

        if ((y1 <= y && y2 > y) || (y1 > y && y2 <= y)) {
          const t = (y - y1) / (y2 - y1);
          const x = Math.round(x1 + t * (x2 - x1));
          const z = z1 + t * (z2 - z1);

          intersections.push({ x: Math.round(x), z });
        }
      }

      intersections.sort((a, b) => a.x - b.x);

      for (let i = 0; i < intersections.length; i += 2) {
        const start = intersections[i];
        const end = intersections[i + 1];

        if (!start || !end) continue;
        for (let x = start.x; x <= end.x; x++) {
          if (x >= width || y >= height || x < 0 || y < 0) break;
          const t = (x - start.x) / (end.x - start.x);

          //Calcula a distância do Z em relação a camera
          const z = start.z + t;
          const distanceZ = (z - camera.near) / (camera.far - camera.near);

          if (zDepth[x][y] > distanceZ) {
            if (selected) {
              zBuffer[x][y] = [200, 0, 0];
            } else {
              zBuffer[x][y] = letter.calculateFlatShading(
                light,
                camera,
                indexFace
              );
            }

            zDepth[x][y] = distanceZ;
          }
        }
      }
    }
  }
  function drawLines(vertices: vec3[], selected: boolean = false) {
    let firstHole = vertices[0];
    for (let i = 1; i < vertices.length - 1; i++) {
      const [x1, y1, z1] = vertices[i];
      const [x2, y2, z2] = vertices[i + 1];

      if (x1 === firstHole[0] && y1 === firstHole[1] && z1 === firstHole[2]) {
        firstHole = vertices[i + 1];
        i++;
        continue;
      }

      const dx = x2 - x1;
      const dy = y2 - y1;
      const dz = z2 - z1;

      const steps = Math.max(Math.abs(dx), Math.abs(dy));

      const xIncrement = dx / steps;
      const yIncrement = dy / steps;
      const zIncrement = dz / steps;

      let x = x1;
      let y = y1;
      let z = z1;

      for (let i = 0; i <= steps; i++) {
        if (x >= width || y >= height || x < 0 || y < 0) break;

        let roundedX = Math.round(x);
        let roundedY = Math.round(y);

        if (zDepth[roundedX][roundedY] > z) {
          if (selected) {
            zBuffer[roundedX][roundedY] = [200, 0, 0];
          } else {
            zBuffer[roundedX][roundedY] = [255, 255, 255];
          }

          zDepth[roundedX][roundedY] = z;
        }

        x += xIncrement;
        y += yIncrement;
        z += zIncrement;
      }
    }
  }

  const draw2D = () => {
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
          if (!object.isFaceVisible(camera, i)) continue;
          const face = object.faces[i].map((vertex) => {
            const vertexSRT = matrixMul(vertex, camera.concatedMatrix) as vec4;
            const x = Math.round(vertexSRT[0] - camera.ViewPort.width[0]);
            const y = Math.round(vertexSRT[1] - camera.ViewPort.height[0]);
            return [x, y, vertexSRT[2]] as vec3;
          });

          if (fillPolygons) fillPolygon(face, false, object, i);
          else drawLines(face, selectedLetter.includes(object.id));
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
  };

  const onClick = (e: MouseEvent) => {
    const offset = canvas.current?.getBoundingClientRect();

    const mouseX = e.clientX + offset!.left;
    const mouseY = e.clientY + offset!.top;
    setLastPosition([mouseX, mouseY]);

    click(mouseX, mouseY, objects, camera, selectedLetter, setSelectedLetter);
    e.stopPropagation();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (e && e.buttons) {
      const offset = canvas.current?.getBoundingClientRect();

      const mouseX = e.clientX + offset!.left;
      const mouseY = e.clientY + offset!.top;

      // if (mouseX >= width || mouseY >= height || mouseX < 0 || mouseY < 0)
      //   return;

      mouseDragged(
        mouseX,
        mouseY,
        e.altKey,
        e.shiftKey,
        lastPosition,
        objects,
        selectedLetter,
        setLastPosition,
        camera.typeCamera
      );

      e.stopPropagation();
    }
  };

  useEffect(() => {
    setTimeout(draw2D, 0);
  }, [
    canvas,
    cameras,
    objects,
    selectedLetter,
    lastPosition,
    light,
    handleChangeLight,
  ]);

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
      handleChangeLight,
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
