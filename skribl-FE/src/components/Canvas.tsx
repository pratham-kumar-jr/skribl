import React, { useCallback, useEffect, useRef, useState } from "react";
import { canvasStore } from "../store/CanvasStore";
interface Props {
  onDraw: (
    context: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    cx: number,
    cy: number
  ) => void;
  onStart: () => void;
  onStop: () => void;
  className?: string;
  onEnd: () => void;
}
interface Point {
  X: number;
  Y: number;
}

const Canvas: React.FC<Props> = ({
  onDraw,
  onStart,
  onStop,
  className,
  onEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [start, setStart] = useState<Point>({ X: 0, Y: 0 });

  const { Height, Width } = canvasStore;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvasStore.setCanvas(canvas);
    }
  }, [canvasRef.current]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.height = Height;
    canvas.width = Width;
    canvas.style.height = "100%";
    canvas.style.width = "100%";
  }, [Height, Width]);

  const startDrawing = useCallback(
    ({ nativeEvent }: any) => {
      let { offsetX, offsetY } = nativeEvent;
      const canvas = canvasRef.current;
      if (!canvas) return;
      if(window.TouchEvent){
        if(nativeEvent.changedTouches?.length){
          offsetX = nativeEvent.changedTouches[0].clientX - canvas.offsetLeft;
          offsetY = nativeEvent.changedTouches[0].clientY - canvas.offsetTop;
        }
      }
      const bound = canvas.getBoundingClientRect();
      const normalizeX = offsetX / bound.width;
      const normalizeY = offsetY / bound.height;
      setStart({ X: normalizeX, Y: normalizeY });
      onStart();
    },
    [onStart, start, canvasRef]
  );

  const finishDrawing = useCallback(() => {
    onStop();
  }, [onStop]);

  const canvasLeave = useCallback(() => {
    onEnd();
  }, [onEnd]);

  const draw = useCallback(
    ({ nativeEvent }: any) => {
      let { offsetX, offsetY } = nativeEvent;
      const canvas = canvasRef.current;
      if (!canvas) return;
      if(window.TouchEvent){
        if(nativeEvent.changedTouches?.length){
          offsetX = nativeEvent.changedTouches[0].clientX - canvas.offsetLeft;
          offsetY = nativeEvent.changedTouches[0].clientY - canvas.offsetTop;
        }
      }
      const bound = canvas.getBoundingClientRect();
      const normalizeX = offsetX / bound.width;
      const normalizeY = offsetY / bound.height;
      const context = canvas.getContext("2d");
      onDraw(context!, start!.X, start!.Y, normalizeX, normalizeY);
      setStart({ X: normalizeX, Y: normalizeY });
    },
    [canvasRef.current, onDraw, start]
  );

  return (
    <canvas
      ref={canvasRef}
      onMouseLeave={canvasLeave}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onTouchStart={startDrawing}
      onTouchEnd={finishDrawing}
      onTouchMove={draw}
      className={className}
    />
  );
};

Canvas.defaultProps = {};

export default React.memo(Canvas);
