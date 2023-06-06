import { useState } from "react";
import Button from "../Atoms/Button/Button";
import { T_ERD, ParseInput, ValidateERD } from "../../model/ERD";
import { ZodError } from "zod";
import { Editor } from "@monaco-editor/react";
import { useERD } from "../../lib/context/ERDContext";
import DisplayError from "./DisplayError";
const CodeEditor: React.FC<{ afterImport: () => void }> = (props) => {
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
      <div className="flex gap-3">
        <Button type="submit" className="py-2 px-4 rounded w-fit mt-2">
          Import
        </Button>
      </div>
    </form>
  );
};

export default CodeEditor;
