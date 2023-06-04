import { useMemo, useState } from "react";
import Button from "../Atoms/Button/Button";
import { DUMMY_JSON, T_ERD, ParseInput, ValidateERD } from "../../model/ERD";
import { ZodError } from "zod";
import { Editor } from "@monaco-editor/react";
import { useERD } from "../../lib/context/ERDContext";

const CodeEditor: React.FC<{ afterImport: () => void }> = (props) => {
  // const [code, setCode] = useState<string>(DUMMY_JSON);
  const [error, setError] = useState<(string | number)[] | null>(null);
  const { setErd, erdJSON, setERDJSON } = useERD();
  function handleParse() {
    try {
      setError(null);
      if (erdJSON.length <= 0) throw new Error("Please Provide Valid JSON");
      // this is check for sanitez input validity
      const erd: T_ERD = ParseInput(erdJSON);
      // check for ERD validity
      ValidateERD(erd);

      setErd(erd);
      props.afterImport();
    } catch (e) {
      if (e instanceof ZodError) {
        setError([e.issues[0].message, ...e.issues[0].path]);
      } else setError(["Please Provide Valid JSON"]);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleParse();
      }}
      className="grid gap-2 h-full grid-rows-[max-content_0.98fr_max-content]"
    >
      <div className="h-full">
        <label htmlFor="import-textarea">
          Enter your JSON for ER Diagram in the textarea below.
        </label>
      </div>
      <div className="grid gap-0 h-90">
        <div>{error && <DisplayError error={error} />}</div>
        <Editor
          defaultLanguage="json"
          defaultValue={erdJSON}
          onChange={(v) => {
            if (v) setERDJSON(v);
            else setERDJSON("");
          }}
          theme="vs-dark"
          className={`${
            error &&
            "border-2 border-red-500 animate-[wiggle_150ms_ease-in-out_3]"
          }`}
        />
      </div>
      <Button type="submit" className="py-2 px-4 rounded w-fit mt-2">
        Import
      </Button>
    </form>
  );
};

function DisplayError(props: { error: (string | number)[] }) {
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
}

export default CodeEditor;
