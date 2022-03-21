import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { EventTypeEnum } from "../Enums/EvenTypeEnum";
import { GameStateEnum } from "../Enums/GameStateEnum";
import { UserRoleEnum } from "../Enums/UserRoleEnum";
import Player from "../model/Player";
import Room, { RoomSetting } from "../model/Room";
import { Helper } from "../utils/Helper";
import { mapService } from "./MapService";
import { webSocketService } from "./WebSocketService";
class GameService {
  private static _instance: GameService | null;

  private constructor() {}

  public static getInstance(): GameService {
    if (!GameService._instance) {
      GameService._instance = new GameService();
    }
    return GameService._instance;
  }

  private _validateSocket(socket: Socket): {
    isValid: boolean;
    player?: Player;
    room?: Room;
  } {
    const player = mapService.getEntity<Player>(socket.id);
    if (!player) {
      console.log(`[Game Service] Player Does not exist.`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Player Does not exist."
      );
      return { isValid: false };
    }

    if (player.role !== UserRoleEnum.CREATER) {
      console.log(`[Game Service] Unauthorized Access.`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Unauthorized Access."
      );
      return { isValid: false };
    }

    const room = mapService.getEntity<Room>(player.roomId || "");

    if (!room) {
      console.log(`[Game Service] Invalid Room Id`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Invalid Room Id"
      );
      return { isValid: false };
    }

    if (!room.players.includes(player.id)) {
      console.log(`[Game Service] Player Does not belongs to Room`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Player Does not belongs to Room"
      );
      return { isValid: false };
    }

    return {
      isValid: true,
      player,
      room,
    };
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

    webSocketService.sendPrivate(socket, EventTypeEnum.ROOM_SYNC, {
      player: {
        name: player.name,
        id: player.id,
        role: UserRoleEnum.CREATER,
      },
      room_id: player.roomId,
      game_state: "lobby",
      player_status: 0,
      me: player.id,
    });
  }

  public joinGame(socket: Socket, payload: PlayerDTO, roomId: string) {
    const room = mapService.get<Room>(roomId);
    if (!room) {
      console.log(`[Game Service] Invalid Room Id`);
      webSocketService.sendPrivate(
        socket,
        EventTypeEnum.ERROR,
        "Invalid Room Id"
      );
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
      return player?.toJson();
    });

    webSocketService.sendPrivate(socket, EventTypeEnum.ROOM_SYNC, {
      room_id: player.roomId,
      game_state: GameStateEnum.LOBBY,
      settings: room.roomSetting,
      me: player.id,
      player_status: 0,
      players,
    });

    webSocketService.sendToRoom(socket, EventTypeEnum.ROOM_SYNC, room.id, {
      player: player.toJson(),
      settings: room.roomSetting,
      player_status: 0,
    });
  }

  public changeGameSettings(socket: Socket, setting: RoomSetting) {
    const { isValid, room } = this._validateSocket(socket);

    if (!isValid) {
      return;
    }

    room!.update(setting);
    webSocketService.sendToRoom(socket, EventTypeEnum.ROOM_SYNC, room!.id, {
      settings: room!.roomSetting,
    });
  }

  public draw(socket: Socket, commands: Array<Array<number>>) {
    const { isValid, room } = this._validateSocket(socket);

    if (!isValid) {
      return;
    }

    webSocketService.sendToRoom(socket, EventTypeEnum.DRAW, room!.id, commands);
  }

  public leaveGame(socket: Socket) {
    const player = mapService.getEntity<Player>(socket.id);

    if (!player) {
      return;
    }

    if (!player.roomId) {
      return;
    }

    const room = mapService.getEntity<Room>(player.roomId);

    if (!room) {
      return;
    }

    mapService.remove(player.id);
    room.removePlayer(player.id);
    player.leaveRoom();
    if (!room.players.length) {
      mapService.remove(room.id);
    } else {
      if (player.role === UserRoleEnum.CREATER) {
        // TODO: Handle In Game Leave
        // promote next player to creater
        const nextPlayer = mapService.getEntity<Player>(room.players[0]);
        nextPlayer?.update(UserRoleEnum.CREATER);
        webSocketService.sendToRoomByIO(EventTypeEnum.ROOM_SYNC, room.id, {
          player_status: 2,
          player: nextPlayer?.toJson(),
        });
      }
      webSocketService.sendToRoomByIO(EventTypeEnum.ROOM_SYNC, room.id, {
        player_status: 1,
        player: player.toJson(),
      });
    }
  }
}

export const gameService = GameService.getInstance();
