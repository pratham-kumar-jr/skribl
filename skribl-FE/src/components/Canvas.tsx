import React, { useCallback, useEffect, useRef, useState } from "react";
import { canvasStore } from "../store/CanvasStore";
interface Props {
  onDraw:(context:CanvasRenderingContext2D, sx:number,sy:number,cx:number,cy:number)=>void;
  onStart : ()=>void;
  onStop: ()=>void;
  className?:string
  onClear?:()=>void;
}
interface Point {
  X: number;
  Y: number;
}

const Canvas: React.FC<Props> = ({onDraw,onStart,onStop,className}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [start,setStart]  = useState<Point>({X:0,Y:0})
  
  const {Height,Width} = canvasStore;
 
  useEffect(()=>{
    const canvas = canvasRef.current;
    if(canvas){
      canvasStore.setCanvas(canvas);
    }

  },[canvasRef.current])

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas)
      return;
    canvas.height = Height;
    canvas.width = Width;

  },[Height,Width])

  const startDrawing = useCallback(({nativeEvent}:any)=>{ 
    const { offsetX, offsetY } = nativeEvent;
    setStart({X:offsetX,Y:offsetY});
    onStart();
  },[onStart,start]);

  const finishDrawing = useCallback( ()=>{
      onStop();
  },[onStop])

  const draw = useCallback(({nativeEvent}:any)=>{
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current?.getContext("2d");
    onDraw(context!,start!.X,start!.Y,offsetX,offsetY);
    setStart({X:offsetX,Y:offsetY});
  },[canvasRef.current,onDraw,start]);


  return (
    <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} className={className}></canvas>
  );
};

Canvas.defaultProps = {};

export default React.memo(Canvas);
