import { useState } from "react";
import Button from "./components/Atoms/Button/Button";
import ERDInfo from "./components/Molecules/ERDInfo";
import { useERD } from "./lib/context/ERDContext";
import { motion } from "framer-motion";
const App: React.FC = () => {
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const { erd } = useERD();
  if (!erd)
    return (
      <div>
        ER Data not Defined. Please Import or Add ER Data to view ER Info
      </div>
    );
  return (
    <div className="w-full h-full relative">
      <Button
        className="absolute left-5 top-5 bg-neutral-700 rounded-full p-3"
        onClick={() => {
          setShowInfo(true);
        }}
      >
        ℹ️
      </Button>
      <motion.div
        initial={{
          x: showInfo ? 0 : -350,
        }}
        animate={{
          x: showInfo ? 0 : -350,
        }}
        className="flex flex-col gap-3 absolute top-0 left-0 w-[350px] h-full max-h-full overflow-auto bg-neutral-800 border-r-2 border-neutral-500 p-5 rounded"
      >
        <Button
          className="absolute right-5 bg-neutral-700 rounded-full p-3"
          onClick={() => {
            setShowInfo(false);
          }}
        >
          ❌
        </Button>
        <ERDInfo erd={erd} />
      </motion.div>
    </div>
  );
};

export default App;
