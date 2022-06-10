import Sphere from 'geometry/spheres';
import { createContext, useContext, useState } from 'react';

interface ObjectsProviderInterface {
  objects: Sphere[];
  setObjects: React.Dispatch<React.SetStateAction<Sphere[]>>;
  /**Limpar a cena */
  handleClear: () => void;
  /**Remove a esfera pelo ID
   * @param id ID da esfera
   */
  handleRemoveSphere: (id: string) => void;
}
const ObjectsProviderInitial: ObjectsProviderInterface = {
  objects: [],
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

export function ObjectsProvider({ children }: Props) {
  const [objects, setObjects] = useState<Sphere[]>([]);

  const handleClear = () => {
    setObjects([]);
  };

  const handleRemoveSphere = (id: string) => {
    setObjects((prevState) => prevState.filter((object) => object.id !== id));
  };
  const values = {
    objects,
    setObjects,
    handleClear,
    handleRemoveSphere,
  };
  return <ObjectsP.Provider value={values}>{children}</ObjectsP.Provider>;
}
