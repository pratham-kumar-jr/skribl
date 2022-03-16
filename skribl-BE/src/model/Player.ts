import { Socket } from "socket.io";
import { mapService } from "../service/MapService";
import BaseSchema from "./_base";

class Player extends BaseSchema {
  private socket: Socket;
  private static counter = 0;
  private roomId: string | undefined;

  public constructor(socket: Socket) {
    super("player", Player.counter++);
    this.socket = socket;
    mapService.addEntity<Player>(this.id, this);
  }

  public sendAll(event: string, message: string[]) {
    if (!this.roomId) {
      console.log(`[Player] Id: ${this.id} Room Not Found`);
      return;
    }
    this.socket.to(this.roomId!).emit(event, message);
  }

  public joinRoom(roomId: string) {
    this.roomId = roomId;
    this.socket.join(roomId);
  }

  public leaveRoom() {
    this.socket.leave(this.roomId!);
    this.roomId = undefined;
  }
}

export default Player;
