import { EventTypeEnum } from "../enums/EventTypeEnum";
import { GameStateEnum } from "../enums/GameState";
import store from "../store";
import { canvasService } from "./CanvasService";
import { webSocketService } from "./WebSocketService";

interface RoundSyncResponse {
  game_state?: string;
  scores?: { [palyerId: string]: number };
  turn_player_id?: string;
  round?: number;
  choosing?: boolean;
  word_list?: string[];
  guessed_player_id: string;
  time_left: number;
}
class RoundService {
  private static _instance: RoundService | null;

  private constructor() {}

  public static getInstance(): RoundService {
    if (!RoundService._instance) {
      RoundService._instance = new RoundService();
    }
    return RoundService._instance;
  }

  public init() {
    webSocketService.RegisterEvent(EventTypeEnum.CHAT, this.onChatServer);
    webSocketService.RegisterEvent(EventTypeEnum.DRAW, this.onDrawServer);
    webSocketService.RegisterEvent(
      EventTypeEnum.WORD_REVEAL,
      this.onWordRevealServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.ROUND_SYNC,
      this.onRoundSyncServer
    );
    console.log("[Round Service] Intialized");
  }

  // message
  public onChatClient() {}

  public onDrawClient(commands: Array<Array<number>>) {
    if (store.gameStore.currentPlayerId === store.gameStore.myId)
      webSocketService.EmitEvent(EventTypeEnum.DRAW, { commands });
  }

  // message if(not correct )else playerId guessed
  public onChatServer() {}

  //word
  public onWordRevealServer() {}

  //gameState?,turnplayerId,currentRole, if currentRole === drawer array of words,syncTimer,round,score with playerId
  public onRoundSyncServer(state: RoundSyncResponse) {
    if (state.game_state) {
      store.gameStore.setGameState(state.game_state as GameStateEnum);
    }

    if (state.scores) {
      store.gameStore.setScores(state.scores);
    }

    if (state.turn_player_id) {
      store.gameStore.setCurrentPlayerId(state.turn_player_id);
    }

    if (state.round) {
      store.gameStore.setRound(state.round);
    }

    if (state.choosing) {
      store.gameStore.setChoosing(state.choosing);
    }

    if (state.word_list) {
      store.gameStore.setWordList(state.word_list);
    }

    if (state.time_left) {
      store.gameStore.setTimeLeft(state.time_left);
    }
  }

  //chooseWord,call after wordReveal
  public onRoundSyncClient() {}

  public onDrawServer({ commands }: { commands: Array<Array<number>> }) {
    for (const command of commands) {
      if (command[0] === 1) {
        canvasService.eraseOnCanvas(command[1], command[2]);
      } else if (command[0] === 0) {
        canvasService.drawOnCanvas(
          command[1],
          command[2],
          command[3],
          command[4]
        );
      } else if (command[0] === 2) {
        canvasService.clearCanvas();
      }
    }
  }
}

export const roundService = RoundService.getInstance();
