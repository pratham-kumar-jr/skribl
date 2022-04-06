import React, { ChangeEventHandler, KeyboardEventHandler } from "react";

interface Props {
    onChange:ChangeEventHandler<HTMLInputElement>
    value:string
    className?:string
    placeholder?:string;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}

const Input: React.FC<Props> = ({onChange,value,className,placeholder, onKeyDown}) => {
  return<input onChange={onChange} value={value} placeholder={placeholder} 
  className={`bg-transparent mx-1 h-full w-full focus:outline-none p-2 ${className}`}
  onKeyDown={onKeyDown}
  />
}

Input.defaultProps = {};

export default React.memo(Input);