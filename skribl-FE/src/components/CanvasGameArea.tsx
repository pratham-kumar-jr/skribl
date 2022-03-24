import { observer } from "mobx-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { canvasService } from "../services/CanvasService";
import store from "../store";
import Button from "./Button";
import Canvas from "./Canvas";

interface Props {}

const CanvasGameArea: React.FC<Props> = (props) => {
  const [drawing, setDrawing] = useState(false);
  const [pencil, setPencil] = useState(0);

  const {myId,currentPlayerId} = store.gameStore

  const myChance = useMemo(()=>{return myId!==undefined &&  currentPlayerId === myId},[currentPlayerId,myId])
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
    if(myChance)
      setDrawing(true);
  }, [myChance]);

  const endDrawing = useCallback(() => {
    setDrawing(false);
  }, [myChance]);

  const selectPencil = ()=>{
    if(myChance)
      setPencil(0);
  }

  const selectEraser = ()=>{
    if(myChance)
      setPencil(1);
  }

  const selectClear = ()=>{
    if(!myChance)
      return;
    canvasService.clearCanvas();
    canvasService.searlizeCanvas([2]);
    setPencil(0);
  }

  return (
    <>
    <div className="bg-blue-200 w-full h-full border border-black" ref={containerRef}>
      <Canvas onDraw={onDrawing} onStart={startDrawing} onStop={endDrawing} className="bg-white w-full h-full" />
    </div>
    <div className="mt-4 flex justify-between">
      <Button onClick={selectPencil}>Pencil</Button>
      <Button onClick={selectEraser}>Eraser</Button>
      <Button onClick={selectClear}>Clear</Button>
    </div>
    </>
  );
};

CanvasGameArea.defaultProps = {};

export default observer(CanvasGameArea);
