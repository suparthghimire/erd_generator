import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import { T_Attribute, T_ERD } from "../../model/ERD";

type T_ERD_EXT = T_ERD & {
  attributes: T_Attribute[];
};
const ERDContext = createContext<{
  erd: {
    entities: T_ERD["entities"];
    attributes: T_Attribute[];
    relationships?: T_ERD["relationships"];
  } | null;
  setErd: (erd: T_ERD) => void;
}>({
  erd: null,
  setErd: () => {},
});

export const useERD = () => useContext(ERDContext);

const ERDProvider: React.FC<PropsWithChildren> = (props) => {
  const [erd, setErd] = useState<T_ERD_EXT | null>(null);

  const saveErd = (erd: T_ERD) => {
    const attributes = erd.entities.reduce((acc, entity) => {
      return [...acc, ...(entity.attributes ?? [])];
    }, [] as T_Attribute[]);
    setErd({
      ...erd,
      attributes,
    });
  };

  return (
    <ERDContext.Provider
      value={{
        erd: erd,
        setErd: saveErd,
      }}
    >
      {props.children}
    </ERDContext.Provider>
  );
};

export default ERDProvider;
