import { io, Socket } from "socket.io-client";
import { WebSocketConfig } from "../configs/WebSocket.Config";
import { EventTypeEnum } from "../enums/EventTypeEnum";

class WebSocketService {
  private static _instance: WebSocketService | null;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService._instance) {
      WebSocketService._instance = new WebSocketService();
    }
    return WebSocketService._instance;
  }

  public init(): void {
    this.socket = io(WebSocketConfig.BASE_URL, {
      transports: ["websocket"],
    });

    this.socket.on("/error", () => {
      window.location.reload();
    });

    console.log("[Web Socket Service] Intialized");
  }

  public EmitEvent(event: EventTypeEnum, payload: { [key: string]: any }) {
    this.socket!.emit(event.toString(), payload);
  }

  public RegisterEvent(
    event: EventTypeEnum | string,
    handler: (e: any) => void
  ) {
    this.socket!.on(event.toString(), handler);
  }
}

export const webSocketService = WebSocketService.getInstance();
