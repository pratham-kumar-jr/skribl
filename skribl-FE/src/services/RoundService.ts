import { EventTypeEnum } from "../enums/EventTypeEnum";
import { GameStateEnum } from "../enums/GameState";
import store from "../store";
import { chatStore } from "../store/ChatStore";
import { gameStore } from "../store/GameStore";
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
  round_start?: boolean;
  round_change?: boolean;
  word_length?: number;
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
    webSocketService.RegisterEvent(EventTypeEnum.CHAT, this.chatServer);
    webSocketService.RegisterEvent(EventTypeEnum.DRAW, this.drawServer);
    webSocketService.RegisterEvent(
      EventTypeEnum.WORD_REVEAL,
      this.wordRevealServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.ROUND_SYNC,
      this.roundSyncServer
    );
    console.log("[Round Service] Intialized");
  }

  public chatClient(message: string) {
    webSocketService.EmitEvent(EventTypeEnum.CHAT, { message });
  }

  public drawClient(commands: Array<Array<number>>) {
    if (store.gameStore.currentPlayerId === store.gameStore.myId)
      webSocketService.EmitEvent(EventTypeEnum.DRAW, { commands });
  }

  public chatServer(data: { message: string; id: string }) {
    const player = gameStore.getPlayerById(data.id);
    chatStore.addChat({ message: data.message, by: player.name });
  }

  public wordRevealServer(data: { word: string }) {
    store.gameStore.setCurrentWord(data.word);
  }

  public wordRevealClient() {
    if (store.gameStore.myChance) {
      webSocketService.EmitEvent(EventTypeEnum.WORD_REVEAL, {});
    }
  }

  public roundSyncServer(state: RoundSyncResponse) {
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

    if (state.choosing !== undefined) {
      if (state.choosing) {
        store.gameStore.setCurrentWord(undefined);
      }
      store.gameStore.setChoosing(state.choosing);
    }

    if (state.word_list) {
      store.gameStore.setWordList(state.word_list);
    }

    if (state.time_left !== undefined) {
      store.gameStore.setTimeLeft(state.time_left);
    }

    if (state.round_start !== undefined) {
      store.gameStore.setRoundStart(state.round_start);
    }

    if (state.word_length) {
      store.gameStore.setWordLength(state.word_length);
    }
  }

  public roundSyncClient(word?: string) {
    if (store.gameStore.myChance) {
      webSocketService.EmitEvent(EventTypeEnum.ROUND_SYNC, {
        chosen_word: word,
      });
    }
  }

  public drawServer({ commands }: { commands: Array<Array<number>> }) {
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
