import React, { useMemo } from "react";

interface Props {
  children: string;
  onClick?: (event: any) => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: boolean;
}

const Button: React.FC<Props> = (props) => {
  const normalButtonClass = useMemo(
    () => `border-2 border-black text-xl p-2 rounded-md 
  text-center w-40 shadow-lg hover:scale-110 hover:text-2xl h-12  
  disabled:opacity-60 ${props.className} `,
    []
  );

  const iconButtonClass = useMemo(()=>`w-12 h-12 border-2 border-black rounded-full pt-1 pl-1 ${props.className} `,[])

  return (
    <button
      type={props.type}
      className={props.icon? iconButtonClass:normalButtonClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  type: "button",
  icon: false,
};

export default React.memo(Button);
