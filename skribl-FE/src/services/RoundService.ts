import { EventTypeEnum } from "../enums/EventTypeEnum";
import { webSocketService } from "./WebSocketService";

class RoundService {
  private static _instance: RoundService | null;

  private constructor() {
    console.log("");
  }

  public static getInstance(): RoundService {
    if (!RoundService._instance) {
      RoundService._instance = new RoundService();
    }
    return RoundService._instance;
  }

  public init() {
    webSocketService.RegisterEvent(
      EventTypeEnum.CHAT_SERVER,
      this.onChatServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.DRAW_SERVER,
      this.onDrawServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.WORD_REVEAL_SERVER,
      this.onWordRevealServer
    );
    webSocketService.RegisterEvent(
      EventTypeEnum.ROUND_SYNC_SERVER,
      this.onRoundSyncServer
    );
    console.log("[Round Service] Intialized");
  }

  public onChatClient() {
    console.log("");
  }

  public onDrawClient() {
    console.log("");
  }

  public onChatServer() {
    console.log("");
  }

  public onWordRevealServer() {
    console.log("");
  }

  public onRoundSyncServer() {
    console.log("");
  }

  public onDrawServer() {
    console.log("");
  }
}

export const roundService = RoundService.getInstance();
