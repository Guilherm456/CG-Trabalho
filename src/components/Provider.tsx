import Sphere from 'geometry/spheres';
import { createContext, useContext, useState } from 'react';
import { Camera } from './Camera';

import { Coord } from 'utils/interfaces';
import { Light } from './Light';

interface ObjectsProviderInterface {
  objects: Sphere[];
  setObjects: React.Dispatch<React.SetStateAction<Sphere[]>>;
  camera: Camera;
  light: Light;
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
  light: new Light([0, 0, 0], [0, 0, 0], [0, 0, 0]),
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
      Ka: [0.1, 0.1, 0.1],
      Kd: [0.3, 0.3, 0.3],
      Ks: [0, 0, 0],

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
  const [light] = useState<Light>(
    new Light([-100, 0, 0], [255, 255, 255], [255, 255, 255])
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
    light,
    handleClear,
    handleRemoveSphere,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
