import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { EventTypeEnum } from "../Enums/EvenTypeEnum";
import { RoomSetting } from "../model/Room";
import { gameService } from "../service/GameService";
import { roundService } from "../service/RoundService";

const gameCreateHandler = (socket: Socket) => {
  socket.on(EventTypeEnum.CREATE_GAME, ({ player }: { player: PlayerDTO }) => {
    gameService.createGame(socket, player);
  });
};

const gameJoinHandler = (socket: Socket) => {
  socket.on(
    EventTypeEnum.JOIN_GAME,
    ({ player, roomId }: { player: PlayerDTO; roomId: string }) => {
      gameService.joinGame(socket, player, roomId);
    }
  );
};

const gameRoomSyncHandler = (socket: Socket) => {
  socket.on(
    EventTypeEnum.ROOM_SYNC,
    (data: { new_game?: boolean; settings?: RoomSetting }) => {
      if (data.settings) {
        gameService.changeGameSettings(socket, data.settings);
      }
      if (data.new_game) {
        gameService.reGame(socket);
      }
    }
  );
};

const drawHandler = (socket: Socket) => {
  socket.on(EventTypeEnum.DRAW, (commands: Array<Array<number>>) => {
    gameService.draw(socket, commands);
  });
};

const gameLeaveHandler = (socket: Socket) => {
  socket.on(EventTypeEnum.DISCONNECT, () => {
    gameService.leaveGame(socket);
    console.log(`[Handler] User Disconnected : ${socket.id}`);
  });
};

const gameChatHandler = (socket: Socket) => {
  socket.on(EventTypeEnum.CHAT, (data: { message: string }) => {
    roundService.gameChat(socket, data.message);
  });
};

const gameRoundSyncHandler = (socket: Socket) => {
  socket.on(EventTypeEnum.ROUND_SYNC, (data: { chosen_word?: string }) => {
    roundService.roundSync(socket, data.chosen_word);
  });
};

const gameStartHandler = (socket: Socket) => {
  socket.on(EventTypeEnum.START_GAME, () => {
    gameService.startGame(socket);
  });
};

const gameWordRevealHandler = (socket: Socket) => {
  socket.on(EventTypeEnum.WORD_REVEAL, () => {
    roundService.wordReveal(socket);
  });
};

export default {
  gameCreateHandler,
  gameJoinHandler,
  gameRoomSyncHandler,
  drawHandler,
  gameLeaveHandler,
  gameChatHandler,
  gameRoundSyncHandler,
  gameStartHandler,
  gameWordRevealHandler,
};
