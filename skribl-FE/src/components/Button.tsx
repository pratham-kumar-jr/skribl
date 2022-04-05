import React, { useMemo } from "react";
import { IconType } from "react-icons/lib";

interface Props {
  children?: string;
  onClick?: (event: any) => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: IconType;
  iconBorder?:boolean;
}

const Button: React.FC<Props> = (props) => {
  const normalButtonClass = useMemo(
    () => `border-2 border-black text-xl p-2 rounded-md 
  text-center w-40 shadow-lg hover:scale-110 hover:text-2xl h-12  
  disabled:opacity-60 ${props.className} `,
    []
  );

  const iconButtonClass = useMemo(
    () =>
      `w-10 h-10 ${props.iconBorder ? "border border-black rounded-md":""} ${props.className} `,
    []
  );

  return (
    <button
      type={props.type}
      className={props.icon ? iconButtonClass : normalButtonClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {" "}
      {props.icon && <props.icon className="w-full h-full hover:animate-pulse" />}
      {props.children && <p>{props.children}</p>}
    </button>
  );
};

Button.defaultProps = {
  type: "button",
  iconBorder:true
};

export default React.memo(Button);
