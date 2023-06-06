import { useState } from "react";
import Button from "../../Atoms/Button/Button";
import Modal from "../../Atoms/Modal/Modal";
import CodeEditor from "../../Molecules/CodeEditor";
import { useLocalStorage } from "@mantine/hooks";
import { useERD } from "../../../lib/context/ERDContext";
import { ZodError } from "zod";
import {
  AES_KEY,
  ERD_PROFILE_STORAGE_KEY,
  ParseInput,
  T_ERD,
  T_STORAGE_ERD_PROFILE,
  ValidateERD,
} from "../../../model/ERD";
import CryptoJS from "crypto-js";
import DisplayError from "../../Molecules/DisplayError";
// import JSONEditor from "../../Molecules/JSONEditor";

export const Header = () => {
  const [openCodeEditor, setOpenCodeEditor] = useState<boolean>(false);
  const [openProfilesModal, setOpenProfilesModal] = useState<boolean>(false);

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
          <Button
            className="p-2 rounded"
            variant="SECONDARY"
            onClick={() => setOpenProfilesModal(true)}
          >
            Load Existing Profiles
          </Button>
        </div>
      </header>
      <Modal
        title="Import ER From JSON"
        onClose={() => setOpenCodeEditor(false)}
        opened={openCodeEditor}
      >
        <CodeEditor afterImport={() => setOpenCodeEditor(false)} />
      </Modal>
      <Modal
        title="Import ER From JSON"
        onClose={() => setOpenProfilesModal(false)}
        opened={openProfilesModal}
      >
        <ProfileSelector close={() => setOpenProfilesModal(false)} />
      </Modal>
    </>
  );
};

const ProfileSelector: React.FC<{
  close: Function;
}> = (props) => {
  const [loadedProfileIdx, setLoadedProfileIdx] = useState(0);
  const [error, setError] = useState<(string | number)[] | null>(null);
  const [profiles] = useLocalStorage<T_STORAGE_ERD_PROFILE>({
    key: ERD_PROFILE_STORAGE_KEY,
  });
  const { setERDJSON, setErd } = useERD();
  return (
    <>
      {profiles && profiles.length > 0 ? (
        <div className="grid gap-3">
          <div>{error && <DisplayError error={error} />}</div>
          <select
            name="profile"
            id="profile"
            className="p-3 rounded focus:outline-none text-black"
            value={loadedProfileIdx}
            onChange={(e) => {
              console.log(parseInt(e.target.value));
              setLoadedProfileIdx(parseInt(e.target.value));
            }}
          >
            {profiles.map((profile, idx) => (
              <option value={idx} key={`${profile.name}-${idx}`}>
                {profile.name}
              </option>
            ))}
          </select>
          <Button
            className="p-2 rounded"
            onClick={() => {
              try {
                const profileHash = profiles[loadedProfileIdx].profileHash;
                const erdJSON = CryptoJS.AES.decrypt(
                  profileHash,
                  AES_KEY
                ).toString(CryptoJS.enc.Utf8);

                // if this is error, it will throw error
                const erd: T_ERD = ParseInput(erdJSON);
                setERDJSON(erdJSON);
                ValidateERD(erd);
                setErd(erd);
                props.close();
              } catch (e) {
                console.log(e);
                if (e instanceof ZodError) {
                  setError([e.issues[0].message, ...e.issues[0].path]);
                } else setError(["Please Provide Valid JSON"]);
              }
            }}
          >
            Load Profile
          </Button>
        </div>
      ) : (
        <>No Profiles Available</>
      )}
    </>
  );
};
