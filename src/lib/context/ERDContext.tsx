import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import { DUMMY_JSON, T_Attribute, T_ERD } from "../../model/ERD";

const ERDContext = createContext<{
  erd: T_ERD | null;
  setErd: (erd: T_ERD) => void;
  erdJSON: string;
  setERDJSON: (erdJSON: string) => void;
}>({
  erd: null,
  setErd: () => {},
  erdJSON: DUMMY_JSON,
  setERDJSON: () => {},
});

export const useERD = () => useContext(ERDContext);

const ERDProvider: React.FC<PropsWithChildren> = (props) => {
  const [erd, setErd] = useState<T_ERD | null>(null);
  const [erdJSON, setERDJSON] = useState<string>(DUMMY_JSON);
  const saveErd = (erd: T_ERD) => {
    const attributes = erd.entities.reduce((acc, entity) => {
      return [...acc, ...(entity.attributes ?? [])];
    }, [] as T_Attribute[]);

    const attrInRelationships = erd.relationships?.reduce(
      (acc, relationship) => {
        return [...acc, ...(relationship.attributes ?? [])];
      },
      [] as T_Attribute[]
    );
    const allAttributes = [...attributes, ...(attrInRelationships ?? [])];

    setErd({
      ...erd,
      attributes: allAttributes,
    });
  };

  return (
    <ERDContext.Provider
      value={{
        erd: erd,
        setErd: saveErd,
        erdJSON: erdJSON,
        setERDJSON: setERDJSON,
      }}
    >
      {props.children}
    </ERDContext.Provider>
  );
};

export default ERDProvider;
