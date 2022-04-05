import { Socket } from "socket.io";
import { EventTypeEnum } from "../Enums/EvenTypeEnum";
import { GameStateEnum } from "../Enums/GameStateEnum";
import Player from "../model/Player";
import { gameHelperService } from "./GameHelperService";
import { mapService } from "./MapService";
import { webSocketService } from "./WebSocketService";

class RoundService {
  private static _instance: RoundService | null;

  private constructor() {}

  public static getInstance(): RoundService {
    if (!RoundService._instance) {
      RoundService._instance = new RoundService();
    }
    return RoundService._instance;
  }

  public async wordReveal(socket: Socket) {
    const { player, room } = gameHelperService.getPlayerAndRoom(socket, false);
    if (!player || !room) {
      return;
    }

    webSocketService.sendToRoom(socket, EventTypeEnum.WORD_REVEAL, room.id, {
      word: room.currentWord,
    });
    webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
      round_start: false,
    });
    setTimeout(this.roundSync, 5000, socket);
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
        room.changeScore(player.id, curScore + timeLeft * 5);
        room.changeScore(drawerId, room.scores[drawerId] + timeLeft * 2);
        room.markPlayerGuessed(player.id);
        webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
          scores: room.scores,
          guessed_player_id: player.id,
          time_left: timeLeft - 1,
        });
      }

      if (room.getGuessPlayerCount() + 1 === room.players.length) {
        webSocketService.sendToRoom(
          socket,
          EventTypeEnum.WORD_REVEAL,
          room.id,
          {
            word: room.currentWord,
          }
        );

        webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
          round_start: false,
        });
        setTimeout(this.roundSync, 5000, socket);
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
      room.resetRound();
      webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
        choosing: false,
        round_start: true,
        word_length: chosenWord.length,
      });
    } else {
      if (room.isFinalOver()) {
        webSocketService.sendToRoomByIO(EventTypeEnum.END_GAME, room.id, {
          game_state: GameStateEnum.END,
          scores: room.scores,
        });
      } else if (
        room.roomSetting.round_time - room.timeElapsed <= 0 ||
        room.getGuessPlayerCount() + 1 === room.players.length
      ) {
        if (room.chanceCount === room.players.length) {
          room.updateCurrentRound(room.currentRound + 1);
          room.setChanceCount(1);
        } else {
          room.setChanceCount(room.chanceCount + 1);
        }
        room.updateToNextPlayer();
        room.setCurrenWord("");
        room.resetRound();
        const nextPlayerId = room.players[room.currentPlayerIndex];
        webSocketService.sendToRoomByIO(EventTypeEnum.ROUND_SYNC, room.id, {
          scores: room.scores,
          turn_player_id: nextPlayerId,
          round: room.currentRound,
          choosing: true,
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
    }
  }
}

export const roundService = RoundService.getInstance();
