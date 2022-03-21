import { EventTypeEnum } from "../enums/EventTypeEnum";
import { canvasService } from "./CanvasService";
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

  public onDrawClient(commands: Array<Array<number>>) {
    webSocketService.EmitEvent(EventTypeEnum.DRAW, { commands });
  }

  public onChatServer() {}

  public onWordRevealServer() {}

  public onRoundSyncServer() {}

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
