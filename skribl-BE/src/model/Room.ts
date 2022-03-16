import { Socket } from "socket.io";
import { mapService } from "../service/MapService";
import Player from "./Player";
import BaseSchema from "./_base";

class Room extends BaseSchema {
  private static counter = 0;

  public constructor() {
    super("room", Room.counter++);
    mapService.addEntity<Room>(this.id, this);
  }

  public addPlayer(socket: Socket) {
    const player = new Player(socket);
    player.joinRoom(this.id);
    const playerIds = mapService.get<string[]>(this.id) || [];
    if (playerIds.length) {
      playerIds.push(player.id);
    }
    mapService.add<string[]>(this.id, playerIds);
  }
}

export default Room;
