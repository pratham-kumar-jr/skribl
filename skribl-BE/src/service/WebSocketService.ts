import { Server, Socket } from "socket.io";
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
    this.io = new Server(server, {
      transports: ["websocket"],
      cors: {
        origin: ["http://localhost:3000"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`[WebSocketService] User Connected : ${socket.id}`);
      GameHandler.gameCreateHandler(socket);
      GameHandler.gameJoinHandler(socket);
      GameHandler.gameRoomSyncHandler(socket);
    });
  }

  public sendPrivate(socket: Socket, event: string, message: any) {
    this.io?.to(socket.id).emit(event, message);
  }

  public sendToRoom(
    socket: Socket,
    event: string,
    roomId: string,
    message: any
  ) {
    socket.to(roomId).emit(event, message);
  }
}

export const webSocketService = WebSocketService.getInstance();