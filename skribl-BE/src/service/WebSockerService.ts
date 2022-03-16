import { Server } from "socket.io";
import { Server as httpServer } from "http";
import GameHandler from "../handlers/GameHandler";

class WebSocketService {
  private static _instance: WebSocketService | null;

  private constructor() {}

  private io: Server | null = null;

  public static getInstance(): WebSocketService {
    if (!WebSocketService._instance) {
      WebSocketService._instance = new WebSocketService();
    }
    return WebSocketService._instance;
  }

  public init(server: httpServer): void {
    this.io = new Server(server);
    this.io.on("connection", (socket) => {
      console.log(`[WebSocketService] User Connected : ${socket.id}`);
      GameHandler.gameCreateHandler(socket);
      GameHandler.gameJoinHandler(socket);
    });
  }
}

export const webSocketService = WebSocketService.getInstance();
