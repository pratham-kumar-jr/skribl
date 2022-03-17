export enum EventTypeEnum {
  CREATE_GAME_CLIENT = "/game/create",
  CREATE_GAME_SERVER = "/game/create/server",

  JOIN_GAME_CLIENT = "/game/join",
  JOIN_GAME_SERVER = "/game/join/server",

  DRAW_CLIENT = "/game/canvas/draw",
  DRAW_SERVER = "/game/canvas/draw/server",

  CHAT_CLIENT = "/game/chat/guess",
  CHAT_SERVER = "/game/chat/guess/server",

  START = "/game/start",
  START_SERVER = "/game/start/server",

  ROUND_SYNC_SERVER = "/game/round/sync/server",

  WORD_REVEAL_SERVER = "/game/word_reveal/server",

  END_SERVER = "/game/end/server",

  ROOM_SYNC_SERVER = "/game/round/sync/server",
}
