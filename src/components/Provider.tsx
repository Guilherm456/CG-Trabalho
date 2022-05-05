import Sphere from 'geometry/spheres';
import { createContext, useContext, useState } from 'react';

interface ObjectsProviderInterface {
  objects: Sphere[];
  setObjects: React.Dispatch<React.SetStateAction<Sphere[]>>;
}
const ObjectsProviderInitial: ObjectsProviderInterface = {
  objects: [],
  setObjects: () => {},
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
  const values = {
    objects,
    setObjects,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
