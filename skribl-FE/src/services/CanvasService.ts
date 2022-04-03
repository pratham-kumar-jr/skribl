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

    startX *= canvas.width;
    startY *= canvas.height;

    currentX *= canvas.width;
    currentY *= canvas.height;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(currentX, currentY);
    context.fillStyle = "black";
    context.lineWidth = 3;
    context.stroke();
  }

  public clearCanvas() {
    const canvas = canvasStore.Canvas;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);
  }

  public eraseOnCanvas(currentX: number, currentY: number, size = 20) {
    const canvas = canvasStore.Canvas;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    currentX *= canvas.width;
    currentY *= canvas.height;

    context.fillStyle = "white";
    context.fillRect(currentX, currentY, size, size);
  }

  public searlizeCanvas(commands: Array<number>) {
    this.batch.push(commands);
    if (!this.isRequestTimed) {
      setTimeout(() => {
        roundService.drawClient(this.batch);
        this.isRequestTimed = false;
        this.batch = [];
      }, this.batchTime);
    }
    this.isRequestTimed = true;
  }

  public canvasToUrl(): string | undefined {
    return canvasStore.Canvas?.toDataURL();
  }
}

export const canvasService = CanvasService.getInstance();
