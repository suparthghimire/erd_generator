import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import { T_ERD } from "../../model/ERD";

const ERDContext = createContext<{
  erd: T_ERD | null;
  setErd: React.Dispatch<React.SetStateAction<T_ERD | null>>;
}>({
  erd: null,
  setErd: () => {},
});

export const useERD = () => useContext(ERDContext);

const ERDProvider: React.FC<PropsWithChildren> = (props) => {
  const [erd, setErd] = useState<T_ERD | null>(null);

  return (
    <ERDContext.Provider
      value={{
        erd,
        setErd,
      }}
    >
      {props.children}
    </ERDContext.Provider>
  );
};

export default ERDProvider;
