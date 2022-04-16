import React, { useMemo } from "react";
import { IconType } from "react-icons/lib";

interface Props {
  children?: string;
  onClick?: (event: any) => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: IconType;
  iconBorder?: boolean;
}

const Button: React.FC<Props> = (props) => {
  const normalButtonClass = useMemo(
    () => `border-2 border-primary bg-tertiary-2 hover:bg-transparent text-2xl p-2 rounded-md 
  text-center w-44 shadow-lg hover:scale-110 hover:text-2xl h-14  
  disabled:opacity-60 ${props.className} `,
    []
  );

  const iconButtonClass = useMemo(
    () =>
      `w-10 h-10 ${
        props.iconBorder
          ? "border-2 border-primary rounded-md text-secondary-1 bg-tertiary-2 bg-opacity-60 "
          : ""
      } ${props.className} `,
    []
  );

  return (
    <button
      type={props.type}
      className={props.icon ? iconButtonClass : normalButtonClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.icon && <props.icon className="w-full h-full hover:scale-110" />}
      {props.children && <p>{props.children}</p>}
    </button>
  );
};

Button.defaultProps = {
  type: "button",
  iconBorder: true,
};

export default React.memo(Button);
