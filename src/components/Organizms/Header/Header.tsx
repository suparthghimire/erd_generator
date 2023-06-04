import { useState } from "react";
import Button from "../../Atoms/Button/Button";
import Modal from "../../Atoms/Modal/Modal";
import CodeEditor from "../../Molecules/CodeEditor";

export const Header = () => {
  const [openCodeEditor, setOpenCodeEditor] = useState<boolean>(false);

  return (
    <>
      <header className="flex flex-col gap-3 items-start justify-between gap-2 p-10 bg-neutral-900 border-b-2 border-neutral-500 md:flex-row md:items-end">
        <h2 className="text-xl font-bold">ER Diagram Editor</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenCodeEditor(true)}
            className="p-2 rounded"
            variant="PRIMARY"
          >
            Import ER From JSON
          </Button>
          {/* <Button className="p-2 rounded" variant="SECONDARY">
            Use GUI
          </Button> */}
        </div>
      </header>
      <Modal
        title="Import ER From JSON"
        onClose={() => setOpenCodeEditor(false)}
        opened={openCodeEditor}
      >
        <CodeEditor afterImport={() => setOpenCodeEditor(false)} />
      </Modal>
    </>
  );
};
