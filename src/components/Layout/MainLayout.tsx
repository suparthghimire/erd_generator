import React, { PropsWithChildren } from "react";
import { Header } from "../Organizms/Header/Header";

export const MainLayout: React.FC<PropsWithChildren> = (props) => {
  return (
    <div className="w-screen h-screen text-white bg-neutral-800">
      <Header />
      <div className="py-3 px-10">{props.children}</div>
    </div>
  );
};
