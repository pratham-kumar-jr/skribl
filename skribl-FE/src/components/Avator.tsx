import React from "react";

interface Props {
  name:string
}

const Avator: React.FC<Props> = ({name}) => {
  return<div>
    <div className="w-24 h-24 border"></div>
    <p className="text-center border-x border-b">{name}</p>
  </div>
}

Avator.defaultProps = {};

export default React.memo(Avator);