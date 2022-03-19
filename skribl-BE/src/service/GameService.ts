import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { UserRoleEnum } from "../Enums/UserRoleEnum";
import Player from "../model/Player";
import Room, { RoomSetting } from "../model/Room";
import { Helper } from "../utils/Helper";
import { mapService } from "./MapService";
import { webSocketService } from "./WebSocketService";

export enum EventType {
  ROOM_SYNC = "/game/room/sync",
  ERROR = "/error",
}

enum GameState {
  LOBBY = "lobby",
  START = "start",
  END = "end",
  NONE = "none",
}
class GameService {
  private static _instance: GameService | null;

  private constructor() {}

  public static getInstance(): GameService {
    if (!GameService._instance) {
      GameService._instance = new GameService();
    }
    return GameService._instance;
  }

  public createGame(socket: Socket, payload: { name: string; id: string }) {
    const uniqRoomId = Helper.generateRandomString(8, {
      includeLowerCase: true,
      includeUpperCase: true,
      includeNumbers: false,
    });
    const room = new Room(uniqRoomId, {
      total_rounds: 4,
      round_time: 60,
    });
    const player = room.addPlayer(socket, {
      id: socket.id,
      name: payload.name,
      role: UserRoleEnum.CREATER,
    });

    webSocketService.sendPrivate(socket, EventType.ROOM_SYNC, {
      players: [
        {
          name: player.name,
          id: player.id,
          role: UserRoleEnum.CREATER,
        },
      ],
      room_id: player.roomId,
      game_state: "lobby",
    });
  }

  public joinGame(socket: Socket, payload: PlayerDTO, roomId: string) {
    const room = mapService.get<Room>(roomId);
    if (!room) {
      console.log(`[Game Service] Invalid Room Id`);
      webSocketService.sendPrivate(socket, EventType.ERROR, "Invalid Room Id");
      return;
    }

    const player = room.addPlayer(socket, {
      id: socket.id,
      name: payload.name,
      role: UserRoleEnum.JOINER,
    });
    const playerIds = room.players;

    const players = playerIds.map((id) => {
      const player = mapService.getEntity<Player>(id);
      return {
        name: player?.name,
        id: player?.id,
      };
    });

    webSocketService.sendPrivate(socket, EventType.ROOM_SYNC, {
      players: players,
      room_id: player.roomId,
      game_state: GameState.LOBBY,
      settings: room.roomSetting,
      me: {
        name: player.name,
        id: player.id,
        role: UserRoleEnum.JOINER,
      },
    });

    webSocketService.sendToRoom(socket, EventType.ROOM_SYNC, room.id, {
      players,
      settings: room.roomSetting,
    });
  }

  public changeSettings(socket: Socket, setting: RoomSetting) {
    const player = mapService.getEntity<Player>(socket.id);
    if (!player) {
      console.log(`[Game Service] Player Does not exist.`);
      webSocketService.sendPrivate(
        socket,
        EventType.ERROR,
        "Player Does not exist."
      );
      return;
    }

    if (player.role !== UserRoleEnum.CREATER) {
      console.log(`[Game Service] Unauthorized Access.`);
      webSocketService.sendPrivate(
        socket,
        EventType.ERROR,
        "Unauthorized Access."
      );
      return;
    }

    const room = mapService.getEntity<Room>(player.roomId || "");

    if (!room) {
      console.log(`[Game Service] Invalid Room Id`);
      webSocketService.sendPrivate(socket, EventType.ERROR, "Invalid Room Id");
      return;
    }

    if (!room.players.includes(player.id)) {
      console.log(`[Game Service] Player Does not belongs to Room`);
      webSocketService.sendPrivate(
        socket,
        EventType.ERROR,
        "Player Does not belongs to Room"
      );
      return;
    }

    room.update(setting);
    webSocketService.sendToRoom(socket, EventType.ROOM_SYNC, room.id, {
      settings: room.roomSetting,
    });
  }
}

export const gameService = GameService.getInstance();
