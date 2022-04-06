import React, { Dispatch, useCallback, useRef, useState } from "react";
import { canvasService } from "../services/CanvasService";
import Canvas from "./Canvas";
import withCursor from '../HOC/withCursor'
import { canvasStore } from "../store/CanvasStore";
interface Props {
    tool:number,
    drawing:boolean,
    setDrawing:Dispatch<React.SetStateAction<boolean>>,
    context?: any;
}

const AvatarCanvasArea: React.FC<Props> = ({tool,drawing,setDrawing, context}) => {

  // const [cursor, setCursor] = useState<string>('default');
  const {onCursor} = context;

  const onDrawing = useCallback(
    (
      context: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      currentX: number,
      currentY: number
    ) => {
      if (!context || !drawing) return;
      if (tool === 0) {
        canvasService.drawOnCanvas(startX, startY, currentX, currentY);
      } else if (tool === 1) {
        canvasService.eraseOnCanvas(currentX, currentY, 30);
      }
    },
    [drawing, tool]
  );

  const startDrawing = useCallback(() => {
    setDrawing(true);
  }, []);

  const endDrawing = useCallback(() => {
    setDrawing(false);
  }, []);

  const onExit = useCallback(() => {
    setDrawing(false);
  }, []);

  const cursor = React.useMemo(() => {
    if(tool === 0 ) 
      return 'pencil';
    else if(tool === 1)
      return 'eraser';
    else 
      return 'default';
  }, [tool])

  return (
    <>
      <div className="w-full h-full rounded-md cursor-none" onMouseEnter={() => onCursor(cursor)} onMouseLeave={() => onCursor('default')}>
        <Canvas
          onDraw={onDrawing}
          onStart={startDrawing}
          onStop={endDrawing}
          onEnd={onExit}
        />
      </div>
    </>
  );
};

AvatarCanvasArea.defaultProps = {};

export default withCursor(AvatarCanvasArea);
