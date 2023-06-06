import React, { useMemo } from "react";

const DisplayError: React.FC<{
  error: (string | number)[];
}> = (props) => {
  const msg = useMemo(() => props.error.at(0), [props.error.at(0)]);
  const entity = useMemo(() => props.error.at(1), [props.error.at(1)]);
  const idx = useMemo(() => props.error.at(2), [props.error.at(2)]);
  const attribute = useMemo(() => props.error.at(3), [props.error.at(3)]);
  const subIdx = useMemo(() => props.error.at(4), [props.error.at(4)]);
  const subAttribute = useMemo(() => props.error.at(5), [props.error.at(5)]);

  return (
    <div className="text-red-500 text-md">
      <span>Error {msg && ` - ${msg}`}</span>

      {entity && (
        <>
          <span className="font-bold italic"> ---{">"} ER.</span>
          <span className="font-bold italic">{entity}</span>
        </>
      )}
      {idx !== undefined && <span className="font-bold italic">[{idx}]</span>}
      {attribute !== undefined && (
        <span className="font-bold italic">.{attribute}</span>
      )}
      {subIdx !== undefined && (
        <span className="font-bold italic">[{subIdx}]</span>
      )}
      {subAttribute !== undefined && (
        <span className="font-bold italic">.{subAttribute}</span>
      )}
    </div>
  );
};

export default DisplayError;
