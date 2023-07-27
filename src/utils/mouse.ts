import { vec3, vec4 } from './interfaces';
import { matrixMul } from 'utils/calculate';
import { Camera } from '../components/Camera';
import { Letter } from '../components/Letter';

const mouseDragged = (
  mouseX: number,
  mouseY: number,
  metaKey: boolean,
  shiftKey: boolean,
  lastPosition: number[],
  objects: any[],
  selectedLetter: string | any[],
  setLastPosition: (arg0: any[]) => void,
  typeCamera: string
) => {
  const selectedObject = objects.filter((object) =>
    selectedLetter.includes(object.id)
  );
  if (selectedObject.length > 0) {
    selectedObject.forEach((object) => {
      switch (typeCamera) {
        case 'axonometric-front':
          if (metaKey) {
            object.rotate(lastPosition[0] - mouseX, 'X');
          } else if (shiftKey) {
            object.scale(
              1 + (lastPosition[0] - mouseX) * 0.05,
              1 + (lastPosition[1] - mouseY) * 0.05,
              1
            );
          } else {
            object.translate(
              -(lastPosition[0] - mouseX),
              lastPosition[1] - mouseY,
              0
            );
          }
          break;
        case 'axonometric-side':
          if (metaKey) {
            object.rotate(lastPosition[0] - mouseX, 'Y');
          } else if (shiftKey) {
            object.scale(
              1 + (lastPosition[0] - mouseX) * 0.05,
              1 + (-lastPosition[1] - mouseY) * 0.05,
              1
            );
          } else {
            object.translate(
              0,
              lastPosition[1] - mouseY,
              lastPosition[0] - mouseX
            );
          }
          break;
        case 'axonometric-top':
          if (metaKey) {
            object.rotate(lastPosition[0] - mouseX, 'Z');
          } else if (shiftKey) {
            object.scale(
              1 + (lastPosition[0] - mouseX) * 0.05,
              1,
              1,
            );
          } else {
            object.translate(
              lastPosition[0] - mouseX,
              0,
              lastPosition[1] - mouseY
            );
          }
          break;
        case 'perspective':
          if (metaKey) {
            object.rotate(lastPosition[0] - mouseX, 'X');
          } else if (shiftKey) {
            object.scale(
              1 + (lastPosition[0] - mouseX) * 0.05,
              1 + (lastPosition[1] - mouseY) * 0.05,
              1
            );
          } else {
            object.translate(
              -(lastPosition[0] - mouseX),
              lastPosition[1] - mouseY,
              0
            );
          }
          break;
      }
    });

    setLastPosition([mouseX, mouseY]);
  }
};

const getMouseX = (mouseX: number, camera: Camera) => {
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

const click = (
  mouseX: number,
  mouseY: number,
  objects: Letter[],
  camera: Camera,
  selectedLetter: any[],
  setSelectedLetter: (arg0: any[]) => void
) => {
  const transformedMouse = matrixMul(
    [getMouseX(mouseX, camera), mouseY + camera.ViewPort.height[0], 0], // Assume-se que o mouse está na posição Z = 0 na cena
    camera.concatedMatrix
  ) as vec3;

  objects.forEach((object) => {
    object.faces.forEach((face) => {
      if (isPointInsidePolygon(transformedMouse, face, camera.concatedMatrix)) {
        if (selectedLetter.includes(object.id)) {
          setSelectedLetter(
            selectedLetter.filter((letter) => letter !== object.id)
          );
        } else {
          setSelectedLetter([...selectedLetter, object.id]);
        }
      }
    });
  });
};

function isPointInsidePolygon(
  point: vec3,
  vertices: vec3[],
  concatedMatrix: number[][]
): boolean {
  let isInside = false;

  const facesSRT = vertices.map((vertex) => {
    const vertexSRT = matrixMul(vertex, concatedMatrix) as vec4;
    const x = Math.round(vertexSRT[0]);
    const y = Math.round(vertexSRT[1]);
    return [x, y, vertex[2]] as vec3;
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

export { mouseDragged, click };
