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

    // TODO: check if game is in running state
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
    room.removePlayer(player.id);
    player.leaveRoom();
    if (!room.players.length) {
      mapService.remove(room.id);
    } else {
      if (player.role === UserRoleEnum.CREATER) {
        // TODO: Handle In Game Leave
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

    webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
      game_state: GameStateEnum.START,
      scores: room.scores,
      turn_player_id: drawer.id,
      round: room.currentRound,
      choosing: true,
    });

    webSocketService.sendToRoomByIO(EventTypeEnum.DRAW, room.id, {
      commands: [[2]],
    });

    webSocketService.sendPrivate(drawer.mySocket, EventTypeEnum.ROUND_SYNC, {
      word_list: Helper.getWordList(),
    });
  }

  public async gameChat(socket: Socket, message: string) {
    const { player, room } = gameHelperService.getPlayerAndRoom(socket, false);
    if (!player || !room) {
      return;
    }

    const drawerId = room.players[room.currentPlayerIndex];

    if (drawerId === player.id) {
      return;
    }

    if (room.checkGuessWord(message.trim() || "")) {
      if (room.isAlreadyGuessed(player.id)) {
        return;
      }

      const curScore = room.scores[player.id];
      const timeLeft = room.roomSetting.round_time - room.timeElapsed;
      if (timeLeft > 0) {
        room.changeScore(player.id, curScore + timeLeft * 50);
        room.changeScore(drawerId, room.scores[drawerId] + timeLeft * 25);
        room.markPlayerGuessed(player.id);
        webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
          scores: room.scores,
          guessed_player_id: player.id,
          time_left: timeLeft - 1,
        });
      } else {
        webSocketService.sendToRoom(
          socket,
          EventTypeEnum.WORD_REVEAL,
          room.id,
          {
            word: room.currentWord,
          }
        );
      }
    } else {
      webSocketService.sendToRoom(socket, EventTypeEnum.CHAT, room.id, {
        message: message,
        id: player.id,
      });
    }
  }

  public async roundSync(socket: Socket, chosenWord?: string) {
    const { player, room } = gameHelperService.getPlayerAndRoom(socket, false);

    if (!player || !room) {
      return;
    }

    if (chosenWord && chosenWord.trim() !== "") {
      room.setCurrenWord(chosenWord);
      room.startRound();
      webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
        choosing: false,
        round_start: true,
      });
    } else {
      if (room.isFinalOver()) {
        // TODO: change game state to end and send final socres
      } else if (room.timeElapsed <= 0) {
        room.updateCurrentRound();
        room.updateToNextPlayer();
        const nextPlayerId = room.players[room.currentPlayerIndex];
        webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
          scores: room.scores,
          turn_player_id: nextPlayerId,
          round: room.currentRound,
          choosing: true,
        });
        webSocketService.sendToRoomByIO(EventTypeEnum.DRAW, room.id, {
          commands: [[2]],
        });
      }
    }
  }
}

export const gameService = GameService.getInstance();
