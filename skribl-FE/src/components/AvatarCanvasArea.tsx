import React, { Dispatch, useCallback, useState } from "react";
import { canvasService } from "../services/CanvasService";
import Canvas from "./Canvas";
import { canvasStore } from "../store/CanvasStore";
import { CursorTypes } from '../enums/CursorTypes';
interface Props {
    tool:number,
    drawing:boolean,
    setDrawing:Dispatch<React.SetStateAction<boolean>>,
}

const SUPPORTED_CURSORS = [CursorTypes.DEFAULT, CursorTypes.ERASER, CursorTypes.PENCIL];

const AvatarCanvasArea: React.FC<Props> = ({tool,drawing,setDrawing}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const onMouseMove = (event: MouseEvent) => {
    const { pageX: x, pageY: y } = event
    setMousePosition({ x, y })
  }

  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  })

  const { x, y } = mousePosition

  const onCursor = (cursor: CursorTypes) => {
    cursor = (SUPPORTED_CURSORS.includes(cursor) && cursor) || CursorTypes.DEFAULT
    canvasStore.setCursor(cursor);
  };

  const selectCursor = useCallback(() => {
    let cursor = CursorTypes.DEFAULT;
    if(tool === 0 ) 
      cursor = CursorTypes.PENCIL;
    else if(tool === 1)
      cursor = CursorTypes.ERASER;
    onCursor(cursor);
  }, [tool])

  const selectDefaultCursor = useCallback(() => onCursor(CursorTypes.DEFAULT), []);

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

  return (
    <>
      <div className="w-full h-full rounded-md cursor-none" onMouseEnter={selectCursor} onMouseLeave={selectDefaultCursor}>
        <ins
        className={`cursor ${canvasStore.Cursor}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      />
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

export default React.memo(AvatarCanvasArea);
