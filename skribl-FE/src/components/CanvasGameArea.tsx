import { observer } from "mobx-react";
import React, { useCallback, useRef, useState } from "react";
import { canvasService } from "../services/CanvasService";
import store from "../store";
import Button from "./Button";
import Canvas from "./Canvas";

interface Props {}

const CanvasGameArea: React.FC<Props> = (props) => {
  const [drawing, setDrawing] = useState(false);
  const [pencil, setPencil] = useState(0);

  const {myChance,choosing} = store.gameStore

  const containerRef = useRef<HTMLDivElement>(null)

  const onDrawing = useCallback(
    (
      context: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      currentX: number,
      currentY: number
    ) => {
      if (!context || !drawing || !myChance) return;
      if(pencil === 0){
        canvasService.drawOnCanvas(startX, startY, currentX, currentY);
      }else if(pencil === 1){
        canvasService.eraseOnCanvas(currentX,currentY,20);
      }
      canvasService.searlizeCanvas([
        pencil,
        currentX,
        currentY,
        startX,
        startY,
      ]);
    },
    [drawing,pencil]
  );

  const startDrawing = useCallback(() => {
    if(myChance && !choosing)
      setDrawing(true);
  }, [myChance,choosing]);

  const endDrawing = useCallback(() => {
    setDrawing(false);
  }, [myChance,choosing]);

  const selectPencil = ()=>{
    if(myChance && !choosing)
      setPencil(0);
  }

  const selectEraser = ()=>{
    if(myChance && !choosing)
      setPencil(1);
  }

  const selectClear = ()=>{
    if(!myChance && !choosing)
      return;
    canvasService.clearCanvas();
    canvasService.searlizeCanvas([2]);
    setPencil(0);
  }

  return (
    <>
    <div className="bg-blue-200 w-full h-full border-2 border-black rounded-md " ref={containerRef}>
      <Canvas onDraw={onDrawing} onStart={startDrawing} onStop={endDrawing} className="bg-white w-full h-full" />
    </div>
    <div className="mt-4 flex justify-center space-x-4">
      <Button icon={true} onClick={selectPencil}>P</Button>
      <Button icon={true} onClick={selectEraser}>E</Button>
      <Button icon={true} onClick={selectClear}>C</Button>
    </div>
    </>
  );
};

CanvasGameArea.defaultProps = {};

export default observer(CanvasGameArea);
