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
    mapService.setEntity<Room>(this.id, this);
  }

  public addPlayer(socket: Socket, playerPayload: PlayerDTO): Player {
    const player = new Player(socket, playerPayload.name, playerPayload.role!);
    player.joinRoom(this.id);
    this._players.push(player.id);
    mapService.setEntity<Room>(this.id, this);
    return player;
  }

  public get roomSetting(): RoomSetting {
    return this._roomSetting;
  }

  public update(payload: RoomSetting) {
    this._roomSetting = payload;
    mapService.setEntity<Room>(this.id, this);
  }

  public get players(): string[] {
    return this._players;
  }

  public removePlayer(playerId: string) {
    if (playerId.length === 0) {
      console.log("[Room] Empty Room");
      return;
    }
    const pos = this.players.indexOf(playerId);
    if (pos < 0 || pos >= this._players.length) {
      console.log("[Room] Player Does not exist");
      return;
    }
    this.players[pos] = this._players[this._players.length - 1];
    this._players.pop();
    mapService.setEntity<Room>(this.id, this);
  }
}

export default Room;
