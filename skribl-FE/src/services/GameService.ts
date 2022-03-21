import { EventTypeEnum } from "../enums/EventTypeEnum";
import { GamestateEnum } from "../enums/GameState";
import { Player, UserRole } from "../models/entities/Player";
import { RoomSetting } from "../models/interface/RoomSetting";
import { roundService } from "./RoundService";
import { webSocketService } from "./WebSocketService";
import store from "../store";
interface Response {
  // 0 join, 1 left, 2 upgrade
  player_status?: number;
  players: Player[];
  player?: Player;
  game_state?: GamestateEnum;
  room_id?: string;
  settings?: RoomSetting;
  me?: string;
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
    if (res.game_state) store.gameStore.setGameState(res.game_state);
    if (res.player_status !== undefined) {
      if (res.player_status === 0) {
        if (res.players) {
          res.players.map((p) => {
            store.gameStore.addPlayer(p);
          });
        }
        if (res.player) store.gameStore.addPlayer(res.player);
      } else if (res.player_status === 1) {
        store.gameStore.removePlayer(res.player!.id);
      } else if (res.player_status === 2) {
        store.gameStore.addPlayer(res.player!);
      }
    }

    if (res.me) store.gameStore.setMe(res.me);
    if (res.room_id) store.gameStore.setRoomId(res.room_id);
    if (res.settings) store.gameStore.setSetting(res.settings);
  }

  public startGameClient() {
    webSocketService.EmitEvent(EventTypeEnum.START_GAME, {});
  }

  public startGameServer(state: any) {}

  public endGameServer() {}
}

export const gameService = GameService.getInstance();
