import Button from "../Button/Button";
import { PropsWithChildren } from "react";
type Props = {
  opened: boolean;
  onClose: () => void;
  title?: string;
} & PropsWithChildren;

const Modal: React.FC<Props> = (props) => {
  if (!props.opened) return null;

  return (
    <div className="absolute w-screen min-h-screen h-full bg-neutral-800 rounded top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-3 grid grid-rows-[max-content_1fr] gap-5 z-[99999]">
      <div className="w-full">
        <div className="flex justify-between">
          {props.title && <h2 className="text-xl">{props.title}</h2>}
          <Button onClick={() => props.onClose()} className="bg-transparent">
            ❌
          </Button>
        </div>
      </div>
      <div className="h-full">{props.children}</div>
    </div>
  );
};
export default Modal;
