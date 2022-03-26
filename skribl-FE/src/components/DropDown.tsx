import React, { ReactNode } from "react";

interface Props {
  value: number;
  title: string;
  id: string;
  children: ReactNode;
  onChange: (e: any) => void;
  disabled?:boolean
}

const DropDown: React.FC<Props> = (props) => {
  return (
    <div className="flex justify-between items-center m-2 p-2">
      <label className="text-lg font-medium w-40">{props.title}</label>
      <select
        value={props.value}
        onChange={props.onChange}
        className=" disabled:opacity-60 bg-transparent focus:outline-none w-24
        border-2 text-center border-black rounded-md"
        id={props.id}
        disabled={props.disabled}
      >
        {props.children}
      </select>
    </div>
  );
};

DropDown.defaultProps = {};

export default React.memo(DropDown);
