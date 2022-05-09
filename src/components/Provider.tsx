import Sphere from 'geometry/spheres';
import { createContext, useContext, useEffect, useState } from 'react';

interface ObjectsProviderInterface {
  objects: Sphere[];
  setObjects: React.Dispatch<React.SetStateAction<Sphere[]>>;
  cleanScene: () => void;
}
const ObjectsProviderInitial: ObjectsProviderInterface = {
  objects: [],
  setObjects: () => {},
  cleanScene: () => {},
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

export function ObjectsProvider({ children }: Props) {
  const [objects, setObjects] = useState<Sphere[]>([]);

  const cleanScene = () => {
    setObjects([]);
  };

  useEffect(() => {
    console.log(objects);
  }, [objects]);

  const values = {
    objects,
    setObjects,
    cleanScene,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
