import { canvasStore } from "../store/CanvasStore";
import { roundService } from "./RoundService";

class CanvasService {
  private static _instance: CanvasService | null;

  private batch: Array<number[]>;
  private batchTime: number;
  private isRequestTimed: boolean;

  private constructor() {
    this.batch = [];
    this.batchTime = 50;
    this.isRequestTimed = false;
  }

  public static getInstance(): CanvasService {
    if (!CanvasService._instance) {
      CanvasService._instance = new CanvasService();
    }
    return CanvasService._instance;
  }

  public init() {
    console.log("[Canvas Service] Intialized");
  }

  public drawOnCanvas(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number
  ) {
    const canvas = canvasStore.Canvas;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(currentX, currentY);
    context.fillStyle = "black";
    context.stroke();
  }

  public clearCanvas() {
    const canvas = canvasStore.Canvas;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);
  }

  public eraseOnCanvas(currentX: number, currentY: number, size = 20) {
    const canvas = canvasStore.Canvas;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "white";
    context.fillRect(currentX, currentY, size, size);
  }

  public searlizeCanvas(commands: Array<number>) {
    this.batch.push(commands);
    if (!this.isRequestTimed) {
      setTimeout(() => {
        roundService.onDrawClient(this.batch);
        this.isRequestTimed = false;
        this.batch = [];
      }, this.batchTime);
    }
    this.isRequestTimed = true;
  }
}

export const canvasService = CanvasService.getInstance();
