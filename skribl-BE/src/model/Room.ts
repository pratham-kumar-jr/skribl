import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { mapService } from "../service/MapService";
import Player from "./Player";
import BaseSchema from "./_base";

export interface RoomSetting {
  total_rounds: number;
  round_time: number;
}
class Room extends BaseSchema {
  private _players: string[];

  public constructor(id: string, private _roomSetting: RoomSetting) {
    super(id);
    this._players = [];
    mapService.addEntity<Room>(this.id, this);
  }

  public addPlayer(socket: Socket, playerPayload: PlayerDTO): Player {
    const player = new Player(socket, playerPayload.name, playerPayload.role!);
    player.joinRoom(this.id);
    this._players.push(player.id);
    mapService.addEntity<Room>(this.id, this);
    return player;
  }

  public get roomSetting(): RoomSetting {
    return this._roomSetting;
  }

  public update(payload: RoomSetting) {
    this._roomSetting = payload;
    mapService.addEntity<Room>(this.id, this);
  }

  public get players(): string[] {
    return this._players;
  }
}

export default Room;
