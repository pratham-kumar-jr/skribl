import React, { ChangeEventHandler } from "react";

interface Props {
    onChange:ChangeEventHandler<HTMLInputElement>
    value:string
    className?:string
    placeholder?:string
}

const Input: React.FC<Props> = ({onChange,value,className,placeholder}) => {
  return<input onChange={onChange} value={value} placeholder={placeholder} 
  className={`bg-transparent mx-1 h-full w-full focus:outline-none p-2 ${className}`}/>
}

Input.defaultProps = {};

export default React.memo(Input);