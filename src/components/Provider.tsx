import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Camera } from './Camera';

import { vec3 } from 'utils/interfaces';
import { Letter } from './Letter';
import { Light } from './Light';

interface ObjectsProviderInterface {
  objects: Letter[];
  setObjects: React.Dispatch<React.SetStateAction<Letter[]>>;
  cameras: Camera[];
  setCamera: React.Dispatch<React.SetStateAction<Camera[]>>;
  light: Light;
  setLight: React.Dispatch<React.SetStateAction<Light>>;
  /**Limpar a cena */
  handleClear: () => void;
  handleClearObjects: () => void;
  /**Remove a esfera pelo ID
   * @param id ID da esfera
   */
  handleRemoveLetter: (id: string) => void;
  handleChangeLetter: (letter: Letter | Letter[]) => void;
  handleChangeCameras: (camera: Camera | Camera[]) => void;
  handleChangeLight: (light: Light) => void;
}
const ObjectsProviderInitial = {} as ObjectsProviderInterface;
const ObjectsP = createContext<ObjectsProviderInterface>(
  ObjectsProviderInitial
);

export function useObjects() {
  return useContext(ObjectsP);
}

interface Props {
  children: React.ReactNode;
}

//Valores iniciais da câmera
const defaultVRP: vec3 = [0, 0, 100];
const defaultP: vec3 = [0, 0, 0];
const defaultFar: number = 10000;
const defaultNear: number = 20;
const defaultLookUp: vec3 = [0, 1, 0];

//Valores iniciais da luz
const defaultAmbientIntensity: vec3 = [50, 50, 50];
const defaultLightIntensity: vec3 = [120, 120, 120];
const defaultPositionLight: vec3 = [300, 0, 0];

export function ObjectsProvider({ children }: Props) {
  //Inicia uma esfera
  const [objects, setObjects] = useState<Letter[]>([]);

  //Inicia a câmera
  const [cameras, setCamera] = useState<Camera[]>([
    new Camera(
      undefined,
      undefined,
      { width: [-300, 300], height: [-300, 300] },
      { width: [-300, 300], height: [-300, 300] },
      defaultFar,
      defaultNear,
      undefined,
      undefined,
      'axonometric-front'
    ),
    new Camera(
      undefined,
      undefined,
      { width: [-300, 300], height: [-300, 300] },
      { width: [-300, 300], height: [-300, 300] },
      defaultFar,
      defaultNear,
      undefined,
      undefined,
      'axonometric-side'
    ),
    new Camera(
      undefined,
      undefined,
      { width: [-300, 300], height: [-300, 300] },
      { width: [-300, 300], height: [-300, 300] },
      defaultFar,
      defaultNear,
      undefined,
      undefined,
      'axonometric-top'
    ),
    new Camera(
      defaultVRP,
      defaultP,
      { width: [-300, 300], height: [-300, 300] },
      { width: [-300, 300], height: [-300, 300] },
      defaultFar,
      defaultNear,
      defaultLookUp,
      100,
      'perspective'
    ),
  ]);

  //Inicia a luz
  const [light, setLight] = useState<Light>(
    new Light(
      defaultPositionLight,
      defaultAmbientIntensity,
      defaultLightIntensity
    )
  );

  //Limpa os objetos
  const handleClearObjects = () => {
    setObjects([]);
  };

  //Limpa a cena e reseta alguns valores
  const handleClear = () => {
    handleClearObjects();

    // camera.updateVRP_P(defaultVRP, defaultP);
    // camera.setviewUp(defaultLookUp);

    light.setIntensity(defaultAmbientIntensity, defaultLightIntensity);
    light.setPosition(defaultPositionLight);
    light.setRotate(false);
  };

  //Remove uma esfera pelo ID
  const handleRemoveLetter = (id: string) => {
    setObjects((prevState) => prevState.filter((object) => object.id !== id));
  };

  const handleChangeLetter = useCallback(
    (letter: Letter | Letter[]) => {
      let newObjects = [...objects];
      if (Array.isArray(letter)) {
        letter.forEach((obj) => {
          const index = objects.findIndex((object) => object.id === obj.id);
          newObjects[index] = obj;
        });
      } else {
        const index = objects.findIndex((object) => object.id === letter.id);
        newObjects[index] = letter;
      }
      setObjects(newObjects);
    },
    [objects]
  );

  const handleChangeCameras = useCallback(
    (camera: Camera | Camera[]) => {
      let newCameras = [...cameras];
      if (Array.isArray(camera)) {
        camera.forEach((obj) => {
          const index = cameras.findIndex(
            (object) => object.typeCamera === obj.typeCamera
          );
          newCameras[index] = obj;
        });
      } else {
        const index = cameras.findIndex(
          (object) => object.typeCamera === camera.typeCamera
        );
        newCameras[index] = camera;
      }
      setCamera(newCameras);
    },
    [cameras]
  );

  const handleChangeLight = useCallback(
    (newLight: Light) => {
      setLight(newLight);
    },
    [light]
  );

  useEffect(() => console.debug(light), [light]);
  const values = {
    objects,
    setObjects,
    cameras,
    light,
    setLight,
    handleClear,
    handleClearObjects,
    setCamera,
    handleRemoveLetter,
    handleChangeLetter,
    handleChangeCameras,
    handleChangeLight,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
