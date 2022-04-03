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
        origin: ["http://localhost:3000", "https://skribble-app.netlify.app/"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`[WebSocketService] User Connected : ${socket.id}`);
      GameHandler.gameCreateHandler(socket);
      GameHandler.gameJoinHandler(socket);
      GameHandler.gameRoomSyncHandler(socket);
      GameHandler.drawHandler(socket);
      GameHandler.gameLeaveHandler(socket);
      GameHandler.gameChatHandler(socket);
      GameHandler.gameRoundSyncHandler(socket);
      GameHandler.gameStartHandler(socket);
      GameHandler.gameWordRevealHandler(socket);
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

  public sendToAll(socket: Socket, event: string, message: any) {
    socket.broadcast.emit(event, message);
  }

  public sendToRoomByIO(event: string, roomId: string, message: any) {
    this.io?.to(roomId).emit(event, message);
  }
}

export const webSocketService = WebSocketService.getInstance();
