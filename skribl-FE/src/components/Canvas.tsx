import React from "react";

interface Props {
    height:number;
    width:number;
}

const Canvas: React.FC<Props> = ({height,width}) => {
  return<canvas width={width} height={height}></canvas>
}

Canvas.defaultProps = {};

export default React.memo(Canvas);