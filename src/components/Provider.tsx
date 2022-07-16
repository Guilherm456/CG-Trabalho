import Sphere from 'geometry/spheres';
import { createContext, useContext, useState } from 'react';
import { Camera } from './Camera';

import { Coord } from 'utils/interfaces';

interface ObjectsProviderInterface {
  objects: Sphere[];
  setObjects: React.Dispatch<React.SetStateAction<Sphere[]>>;
  camera: Camera;
  /**Limpar a cena */
  handleClear: () => void;
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
    { width: [0, 0], height: [0, 0] }
  ),
  setObjects: () => {},
  handleClear: () => {},
  handleRemoveSphere: () => {},
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

const defaultVRP: Coord = [0, 0, 50];
const defaultP: Coord = [0, 0, 0];

export function ObjectsProvider({ children }: Props) {
  const [objects, setObjects] = useState<Sphere[]>([
    new Sphere({
      center: [0, 0, 0],
      radius: 100,
      color: '#000',
      intensityM: 9,
      intensityP: 9,
      name: 'Sphere',
    }),
  ]);

  const [camera] = useState<Camera>(
    new Camera(
      defaultVRP,
      defaultP,
      { width: [-200, 200], height: [-200, 200] },
      { width: [0, 0], height: [0, 0] }
    )
  );

  const handleClear = () => {
    setObjects([]);
    camera.updateVRP_P(defaultVRP, defaultP);
  };

  const handleRemoveSphere = (id: string) => {
    setObjects((prevState) => prevState.filter((object) => object.id !== id));
  };
  const values = {
    objects,
    setObjects,
    camera,
    handleClear,
    handleRemoveSphere,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
