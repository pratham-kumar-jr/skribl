import React from "react";

interface Props {
  name:string
}

const Avator: React.FC<Props> = ({name}) => {
  return<div className="w-24">
    <div className="h-24 border-2 border-x-blue-400 border-opacity-80 
                border-y-pink-400 p-2 "></div>
    <p className="text-center border-2 border-x-blue-400 border-opacity-80 
                border-b-pink-400">{name}</p>
  </div>
}

Avator.defaultProps = {};

export default React.memo(Avator);