import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { EventTypeEnum } from "../Enums/EvenTypeEnum";
import { RoomSetting } from "../model/Room";
import { gameService } from "../service/GameService";

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
  socket.on(EventTypeEnum.ROOM_SYNC, (settings: RoomSetting) => {
    gameService.changeGameSettings(socket, settings);
  });
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

export default {
  gameCreateHandler,
  gameJoinHandler,
  gameRoomSyncHandler,
  drawHandler,
  gameLeaveHandler,
};
