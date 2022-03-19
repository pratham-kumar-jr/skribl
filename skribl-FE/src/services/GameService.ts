import { EventTypeEnum } from "../enums/EventTypeEnum";
import { GamestateEnum } from "../enums/GameState";
import { Player, UserRole } from "../models/entities/Player";
import { RoomSetting } from "../models/interface/RoomSetting";
import { gameStore } from "../store/GameStore";
import { roundService } from "./RoundService";
import { webSocketService } from "./WebSocketService";

interface Response {
  players?: Player[];
  game_state?: GamestateEnum;
  room_id?: string;
  settings?: RoomSetting;
  me?: Player;
}

class GameService {
  private static _instance: GameService | null;

  private constructor() {}

  public static getInstance(): GameService {
    if (!GameService._instance) {
      GameService._instance = new GameService();
    }
    return GameService._instance;
  }

  public init() {
    webSocketService.init();

    webSocketService.RegisterEvent(
      EventTypeEnum.START_GAME,
      this.startGameServer
    );

    webSocketService.RegisterEvent(
      EventTypeEnum.ROOM_SYNC,
      this.roomSyncServer
    );

    webSocketService.RegisterEvent(EventTypeEnum.END_GAME, this.endGameServer);
    roundService.init();
    console.log("[Game Service] Intialized");
  }

  public createRoomClient(player: Player) {
    webSocketService.EmitEvent(EventTypeEnum.CREATE_GAME, { player });
  }

  public joinRoomClient(roomId: string, player: Player) {
    webSocketService.EmitEvent(EventTypeEnum.JOIN_GAME, { roomId, player });
  }

  public roomSyncClient(settings: RoomSetting) {
    webSocketService.EmitEvent(EventTypeEnum.ROOM_SYNC, settings);
  }

  public roomSyncServer(res: Response) {
    if (res.game_state) gameStore.setGameState(res.game_state);
    if (res.players) gameStore.setPlayers(res.players);
    if (res.me) gameStore.setMe(res.me);
    if (res.room_id) gameStore.setRoomId(res.room_id);
    if (res.settings) {
      gameStore.setSetting(res.settings);
      console.log(res.settings);
    }
  }

  public startGameClient(data: any) {}

  public startGameServer(state: any) {}

  public endGameServer() {}
}

export const gameService = GameService.getInstance();
