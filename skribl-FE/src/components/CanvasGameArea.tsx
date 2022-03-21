import React, { useCallback, useMemo, useRef, useState } from "react";
import { canvasService } from "../services/CanvasService";
import Button from "./Button";
import Canvas from "./Canvas";

interface Props {}

const CanvasGameArea: React.FC<Props> = (props) => {
  const [drawing, setDrawing] = useState(false);
  const [pencil, setPencil] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null)

  const onDrawing = useCallback(
    (
      context: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      currentX: number,
      currentY: number
    ) => {
      if (!context || !drawing) return;
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
    setDrawing(true);
  }, []);

  const endDrawing = useCallback(() => {
    setDrawing(false);
  }, []);

  const selectPencil = ()=>{
    setPencil(0);
  }

  const selectEraser = ()=>{
    setPencil(1);
  }

  const selectClear = ()=>{
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

export default React.memo(CanvasGameArea);
