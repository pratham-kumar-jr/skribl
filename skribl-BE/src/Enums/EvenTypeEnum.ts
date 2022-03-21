export enum EventTypeEnum {
  ERROR = "/error",
  CREATE_GAME = "/game/create",
  JOIN_GAME = "/game/join",
  DRAW = "/game/canvas/draw",
  CHAT = "/game/chat/guess",
  START_GAME = "/game/start",
  ROUND_SYNC = "/game/round/sync",
  WORD_REVEAL = "/game/word_reveal",
  END_GAME = "/game/end",
  ROOM_SYNC = "/game/room/sync",
  DISCONNECT = "disconnect",
}
