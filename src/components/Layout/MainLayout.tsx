import React, { PropsWithChildren } from "react";
import { Header } from "../Organizms/Header/Header";

export const MainLayout: React.FC<PropsWithChildren> = (props) => {
  return (
    <div className="w-screen h-screen text-white bg-neutral-800 grid grid-rows-[120px_1fr]">
      <Header />
      <main className="">{props.children}</main>
    </div>
  );
};
