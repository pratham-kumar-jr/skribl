class GameService {
  private static _instance: GameService | null;

  private constructor() {}

  public static getInstance(): GameService {
    if (!GameService._instance) {
      GameService._instance = new GameService();
    }
    return GameService._instance;
  }

  public createGame(settings: any, playerDTO: any) {
    // TODO: create room
    // and send room id to user
  }

  public joinGame(roomId: any, playerDTO: any) {
    // TODO: join game with given id
    // broadcast to other
  }
}

export const gameService = GameService.getInstance();
