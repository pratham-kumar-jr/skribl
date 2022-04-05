import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { EventTypeEnum } from "../Enums/EvenTypeEnum";
import { GameStateEnum } from "../Enums/GameStateEnum";
import { UserRoleEnum } from "../Enums/UserRoleEnum";
import Player from "../model/Player";
import Room, { RoomSetting } from "../model/Room";
import { Helper } from "../utils/Helper";
import { gameHelperService } from "./GameHelperService";
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

  public createGame(socket: Socket, payload: PlayerDTO) {
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
      avatar: payload.avatar,
    });

    webSocketService.sendPrivate(socket, EventTypeEnum.ROOM_SYNC, {
      player: player.toJson(),
      room_id: player.roomId,
      game_state: GameStateEnum.LOBBY,
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

    if (room.gameStarted) {
      return;
    }

    const player = room.addPlayer(socket, {
      id: socket.id,
      name: payload.name,
      role: UserRoleEnum.JOINER,
      avatar: payload.avatar,
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
    const { player, room } = gameHelperService.getPlayerAndRoom(socket);

    if (!player || !room) {
      return;
    }

    room!.updateSetting(setting);
    webSocketService.sendToRoom(socket, EventTypeEnum.ROOM_SYNC, room!.id, {
      settings: room!.roomSetting,
    });
  }

  public draw(socket: Socket, commands: Array<Array<number>>) {
    const { player, room } = gameHelperService.getPlayerAndRoom(socket, false);

    if (!player || !room) {
      return;
    }

    if (room.players[room.currentPlayerIndex] === player.id) {
      webSocketService.sendToRoom(
        socket,
        EventTypeEnum.DRAW,
        room!.id,
        commands
      );
    }
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
    player.leaveRoom();
    if (room.players.length < 3) {
      mapService.remove(room.id);
      webSocketService.sendToRoomByIO(EventTypeEnum.ERROR, room.id, {});
    } else {
      if (room.players[room.currentPlayerIndex] === player.id) {
        room.updateToNextPlayer();
        room.setCurrenWord("");
        room.resetRound();
        const nextPlayerId = room.players[room.currentPlayerIndex];
        webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
          scores: room.scores,
          turn_player_id: nextPlayerId,
          round: room.currentRound,
          choosing: true,
          round_start: false,
          round_change: true,
        });
        webSocketService.sendToRoomByIO(EventTypeEnum.DRAW, room.id, {
          commands: [[2]],
        });
        const nextPlayer = mapService.getEntity<Player>(nextPlayerId);
        if (!nextPlayer) {
          console.log(
            "[Game Service] Something went wrong, next Player does not exist."
          );
          webSocketService.sendToRoomByIO(
            EventTypeEnum.ERROR,
            room.id,
            "Server Error"
          );
        } else {
          webSocketService.sendPrivate(
            nextPlayer.mySocket,
            EventTypeEnum.ROUND_SYNC,
            {
              word_list: gameHelperService.getRandomWords(),
            }
          );
        }
      }
      if (player.role === UserRoleEnum.CREATER) {
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
    room.removePlayer(player.id);
  }

  public startGame(socket: Socket) {
    const { player, room } = gameHelperService.getPlayerAndRoom(socket);
    if (!player || !room) {
      return;
    }

    const playerIds = room.players;

    if (playerIds.length < 2) {
      return;
    }

    const drawer = mapService.getEntity<Player>(
      Helper.getRandom<string>(playerIds)
    );

    if (!drawer) {
      return;
    }

    room.setCurrentPlayerIndex(room.players.indexOf(drawer.id));
    room.resetScore();
    room.setGameStarted(true);

    webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
      game_state: GameStateEnum.START,
      scores: room.scores,
      turn_player_id: drawer.id,
      round: room.currentRound,
      choosing: true,
      time_left: room.roomSetting.round_time,
    });

    webSocketService.sendToRoomByIO(EventTypeEnum.DRAW, room.id, {
      commands: [[2]],
    });

    webSocketService.sendPrivate(drawer.mySocket, EventTypeEnum.ROUND_SYNC, {
      word_list: gameHelperService.getRandomWords(),
    });
  }

  public reGame(socket: Socket) {
    const { player, room } = gameHelperService.getPlayerAndRoom(socket);

    if (!player || !room) {
      return;
    }

    room.setGameStarted(false);

    room.resetScore();
    room.setCurrenWord("");
    room.resetRound();
    room.setCurrentPlayerIndex(-1);
    room.updateCurrentRound(1);
    webSocketService.sendToRoomByIO(EventTypeEnum.ROOM_SYNC, room.id, {
      game_state: GameStateEnum.LOBBY,
    });
  }
}

export const gameService = GameService.getInstance();
