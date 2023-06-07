import { createContext, useContext, useState } from 'react';
import { Camera } from './Camera';

import { vec3 } from 'utils/interfaces';
import { Letter } from './Letter';
import { Light } from './Light';

interface ObjectsProviderInterface {
  objects: Letter[];
  setObjects: React.Dispatch<React.SetStateAction<Letter[]>>;
  camera: Camera;
  light: Light;
  /**Limpar a cena */
  handleClear: () => void;
  handleClearObjects: () => void;
  /**Remove a esfera pelo ID
   * @param id ID da esfera
   */
  handleRemoveSphere: (id: string) => void;
}
const ObjectsProviderInitial: ObjectsProviderInterface = {
  objects: [],
  camera: new Camera(
    [0, 0, 0],
    [0, 0, 0],
    { width: [0, 0], height: [0, 0] },
    { width: [0, 0], height: [0, 0] },
    10,
    0.1
  ),
  light: new Light([0, 0, 0], [0, 0, 0], [0, 0, 0]),
  setObjects: () => {},
  handleClear: () => {},
  handleRemoveSphere: () => {},
  handleClearObjects: () => {},
};
const ObjectsP = createContext<ObjectsProviderInterface>(
  ObjectsProviderInitial
);

export function ObjectsProviderContext() {
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
  const [objects, setObjects] = useState<Letter[]>([
    new Letter([0, 0, 0], 100, 'A'),
  ]);

  //Inicia a câmera
  const [camera] = useState<Camera>(
    new Camera(
      defaultVRP,
      defaultP,
      { width: [-200, 200], height: [-200, 200] },
      { width: [0, 0], height: [0, 0] },
      defaultFar,
      defaultNear,
      defaultLookUp
    )
  );

  //Inicia a luz
  const [light] = useState<Light>(
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
    camera.updateVRP_P(defaultVRP, defaultP);
    camera.setviewUp(defaultLookUp);

    light.setIntensity(defaultAmbientIntensity, defaultLightIntensity);
    light.setPosition(defaultPositionLight);
    light.setRotate(false);
  };

  //Remove uma esfera pelo ID
  const handleRemoveSphere = (id: string) => {
    setObjects((prevState) => prevState.filter((object) => object.id !== id));
  };
  const values = {
    objects,
    setObjects,
    camera,
    light,
    handleClear,
    handleClearObjects,
    handleRemoveSphere,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
