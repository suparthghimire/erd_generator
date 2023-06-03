import React, { ButtonHTMLAttributes } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "PRIMARY" | "SECONDARY";
};
const Button: React.FC<Props> = (props) => {
  return (
    <button
      type="button"
      {...props}
      className={`cursor-pointer border-0 active:translate-y-[1px] ${
        props.variant === "SECONDARY" ? "bg-rose-500" : "bg-indigo-500"
      } ${props.className}`}
    >
      {props.children}
    </button>
  );
};
export default Button;
