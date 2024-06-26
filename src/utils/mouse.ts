import { matrixMul } from 'utils/calculate';
import { Camera } from '../components/Camera';
import { Letter } from '../components/Letter';
import { vec3 } from './interfaces';

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
            object.scale(1 + (lastPosition[0] - mouseX) * 0.05, 1, 1);
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

const getIfInside = (
  mouseX: number,
  mouseY: number,
  center: vec3,
  camera: Camera,
  topOffset = 0,
  leftOffset = 0
) => {
  const transformedCenter = matrixMul(center, camera.concatedMatrix) as vec3;

  switch (camera.typeCamera) {
    case 'axonometric-front':
      const transformedMousefront = matrixMul(
        [
          mouseX + camera.ViewPort.width[0],
          mouseY + camera.ViewPort.height[0],
          0,
        ],
        camera.concatedMatrix
      ) as vec3;

      return (
        transformedCenter[0] - 2 < transformedMousefront[0] / 10 &&
        transformedCenter[0] + 5 > transformedMousefront[0] / 10 &&
        transformedCenter[1] - 7 < transformedMousefront[1] / 10 &&
        transformedCenter[1] + 3 > transformedMousefront[1] / 10
      );
    case 'axonometric-side':
      const transformedMouseside = matrixMul(
        [
          0,
          mouseX + camera.ViewPort.width[0],
          mouseY + camera.ViewPort.height[0],
        ],
        camera.concatedMatrix
      ) as vec3;

      return (
        transformedCenter[2] - 8 < (transformedMouseside[1] + topOffset) / 10 &&
        transformedCenter[2] + 11 >
          (transformedMouseside[1] + topOffset) / 10 &&
        transformedCenter[1] - 7 < transformedMouseside[0] / 10 &&
        transformedCenter[1] + 3 > transformedMouseside[0] / 10
      );
    case 'axonometric-top':
      const transformedMousetop = matrixMul(
        [
          -(mouseX + camera.ViewPort.width[0]),
          0,
          mouseY + camera.ViewPort.height[0],
        ],
        camera.concatedMatrix
      ) as vec3;

      return (
        transformedCenter[0] - 3 < transformedMousetop[0] / 10 &&
        transformedCenter[0] + 3 > transformedMousetop[0] / 10 &&
        transformedCenter[2] - 8 < (transformedMousetop[1] + leftOffset) / 10 &&
        transformedCenter[2] + 8 > (transformedMousetop[1] + leftOffset) / 10
      );
    case 'perspective':
      return;
  }
};

const click = (
  mouseX: number,
  mouseY: number,
  objects: Letter[],
  camera: Camera,
  selectedLetter: any[],
  setSelectedLetter: (arg0: any[]) => void,
  topOffset = 0,
  leftOffset = 0
) => {
  objects.forEach((object) => {
    if (
      getIfInside(mouseX, mouseY, object.center, camera, topOffset, leftOffset)
    ) {
      if (selectedLetter.includes(object.id)) {
        setSelectedLetter(
          selectedLetter.filter((letter) => letter !== object.id)
        );
      } else {
        setSelectedLetter([...selectedLetter, object.id]);
      }
    }
  });
};

export { click, mouseDragged };
