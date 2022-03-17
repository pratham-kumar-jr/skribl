import { EventTypeEnum } from "../enums/EventTypeEnum";
import { GamestateEnum } from "../enums/GameState";
import { Game } from "../models/entities/Game";
import { Player } from "../models/entities/Player";
import { roundService } from "./RoundService";
import { webSocketService } from "./WebSocketService";

class GameService {
  private static _instance: GameService | null;
  private game: Game;

  private constructor() {
    this.game = {
      game_state: GamestateEnum.NONE,
    };
  }

  public static getInstance(): GameService {
    if (!GameService._instance) {
      GameService._instance = new GameService();
    }
    return GameService._instance;
  }

  public init() {
    webSocketService.init();
    webSocketService.RegisterEvent(
      EventTypeEnum.CREATE_GAME_SERVER,
      this.onCreateRoomServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.JOIN_GAME_SERVER,
      this.onJoinRoomServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.START_SERVER,
      this.onStartServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.ROOM_SYNC_SERVER,
      this.onRoomSyncServer
    );
    webSocketService.RegisterEvent(EventTypeEnum.END_SERVER, this.onEndServer);
    roundService.init();
    console.log("[Game Service] Intialized");
  }

  public onCreateRoomClient() {
    console.log("");
  }

  public onJoinRoomClient() {
    console.log("");
  }

  public onStartClient(data: any) {
    console.log("");
  }

  public onCreateRoomServer() {
    console.log("");
  }

  public onJoinRoomServer(game: Game) {
    this.game = game;
  }

  public onStartServer() {
    console.log("");
  }

  public onRoomSyncServer(data: {
    player_change: boolean;
    players: Player[];
    game_state: GamestateEnum;
  }) {
    if (data.player_change) this.game.players = data.players;
    this.game.game_state = data.game_state;
  }

  public onEndServer() {
    console.log("");
  }
}

export const gameService = GameService.getInstance();
