import { Socket } from "socket.io";
import { gameService } from "../service/GameService";

const gameCreateHandler = (socket: Socket) => {
  socket.on("/game/create", gameService.createGame);
};

const gameJoinHandler = (socket: Socket) => {
  socket.on("/game/join", gameService.joinGame);
};

export default {
  gameCreateHandler,
  gameJoinHandler,
};
