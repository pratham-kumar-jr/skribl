import { Socket } from "socket.io";
import { EventTypeEnum } from "../Enums/EvenTypeEnum";
import { UserRoleEnum } from "../Enums/UserRoleEnum";
import Player from "../model/Player";
import Room from "../model/Room";
import { mapService } from "./MapService";
import { webSocketService } from "./WebSocketService";
import fs from "fs";
import { random } from "lodash";
class GameHelperService {
  private static _instance: GameHelperService | null;
  private readonly wordlist: string[];

  private constructor() {
    this.wordlist = fs.readFileSync("src/utils/word.txt", "utf-8").split(",\n");
  }

  public static getInstance(): GameHelperService {
    if (!GameHelperService._instance) {
      GameHelperService._instance = new GameHelperService();
    }
    return GameHelperService._instance;
  }

  public getPlayer(socket: Socket) {
    const player = mapService.getEntity<Player>(socket.id);
    if (!player) {
      console.log(`[Game Service] Player Does not exist.`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Player Does not exist."
      );
      return;
    }
    return player;
  }

  public checkPlayer(
    socket: Socket,
    player: Player,
    role: UserRoleEnum
  ): boolean {
    if (player.role !== role) {
      console.log(`[Game Service] Unauthorized Access.`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Unauthorized Access."
      );
      return false;
    }
    return true;
  }

  public checkPlayerRoom(socket: Socket, player: Player): Room | undefined {
    const room = mapService.getEntity<Room>(player.roomId || "");

    if (!room) {
      console.log(`[Game Service] Invalid Room Id`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Invalid Room Id"
      );
      return;
    }

    if (!room.players.includes(player.id)) {
      console.log(`[Game Service] Player Does not belongs to Room`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Player Does not belongs to Room"
      );
      return;
    }
    return room;
  }

  public getPlayerAndRoom(
    socket: Socket,
    roleCheck: boolean = true
  ): {
    player?: Player;
    room?: Room;
  } {
    const player = this.getPlayer(socket);
    if (!player) {
      return {};
    }

    if (roleCheck && !this.checkPlayer(socket, player, UserRoleEnum.CREATER)) {
      return {};
    }

    const room = this.checkPlayerRoom(socket, player);

    if (!player) {
      return { player };
    }

    return { player, room };
  }

  public getRandomWords(): string[] {
    const index = random(0, this.wordlist.length - 1);
    return [
      this.wordlist[index],
      this.wordlist[(index + 1) % this.wordlist.length],
      this.wordlist[(index + 2) % this.wordlist.length],
    ];
  }
}

export const gameHelperService = GameHelperService.getInstance();
