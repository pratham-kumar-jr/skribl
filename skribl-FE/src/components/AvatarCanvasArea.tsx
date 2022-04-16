import React, { Dispatch, useCallback, useState } from "react";
import { canvasService } from "../services/CanvasService";
import Canvas from "./Canvas";
interface Props {
  tool: number;
  drawing: boolean;
  setDrawing: Dispatch<React.SetStateAction<boolean>>;
}

const AvatarCanvasArea: React.FC<Props> = ({ tool, drawing, setDrawing }) => {
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
      <Canvas
        onDraw={onDrawing}
        onStart={startDrawing}
        onStop={endDrawing}
        onEnd={onExit}
      />
    </>
  );
};

AvatarCanvasArea.defaultProps = {};

export default React.memo(AvatarCanvasArea);
