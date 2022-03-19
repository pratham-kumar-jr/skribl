import { EventTypeEnum } from "../enums/EventTypeEnum";
import { webSocketService } from "./WebSocketService";

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

  public onChatClient() {}

  public onDrawClient() {}

  public onChatServer() {}

  public onWordRevealServer() {}

  public onRoundSyncServer() {}

  public onDrawServer() {}
}

export const roundService = RoundService.getInstance();
