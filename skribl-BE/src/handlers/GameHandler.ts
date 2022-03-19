import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { RoomSetting } from "../model/Room";
import { EventType, gameService } from "../service/GameService";

const gameCreateHandler = (socket: Socket) => {
  socket.on("/game/create", ({ player }: { player: PlayerDTO }) => {
    gameService.createGame(socket, player);
  });
};

const gameJoinHandler = (socket: Socket) => {
  socket.on(
    "/game/join",
    ({ player, roomId }: { player: PlayerDTO; roomId: string }) => {
      gameService.joinGame(socket, player, roomId);
    }
  );
};

const gameRoomSyncHandler = (Socket: Socket) => {
  Socket.on(EventType.ROOM_SYNC, (settings: RoomSetting) => {
    gameService.changeSettings(Socket, settings);
  });
};

export default {
  gameCreateHandler,
  gameJoinHandler,
  gameRoomSyncHandler,
};
