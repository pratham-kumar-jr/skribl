import { Socket } from "socket.io";
import { UserRoleEnum } from "../Enums/UserRoleEnum";
import { mapService } from "../service/MapService";
import BaseSchema from "./_base";

class Player extends BaseSchema {
  private _roomId: string | undefined;

  public constructor(
    private _socket: Socket,
    private _name: string,
    private _role: UserRoleEnum
  ) {
    super(_socket.id);
    mapService.addEntity<Player>(this.id, this);
  }

  public joinRoom(roomId: string) {
    this._roomId = roomId;
    this._socket.join(roomId);
  }

  public leaveRoom() {
    this._socket.leave(this._roomId!);
    this._roomId = undefined;
  }

  public get name(): string {
    return this._name;
  }
  public get roomId(): string | undefined {
    return this._roomId;
  }
  public get role(): UserRoleEnum {
    return this._role;
  }
}

export default Player;
