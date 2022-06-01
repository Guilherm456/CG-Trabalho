import Sphere from 'geometry/spheres';
import { createContext, useContext, useEffect, useState } from 'react';

interface ObjectsProviderInterface {
  objects: Sphere[];
  setObjects: React.Dispatch<React.SetStateAction<Sphere[]>>;
  handleClear: () => void;
}
const ObjectsProviderInitial: ObjectsProviderInterface = {
  objects: [],
  setObjects: () => {},
  handleClear: () => {},
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

  const handleClear = () => {
    setObjects([]);
  };
  const values = {
    objects,
    setObjects,
    handleClear,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
