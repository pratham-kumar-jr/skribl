import { action, computed, makeObservable, observable } from "mobx";
import { GamestateEnum } from "../enums/GameState";
import { Player } from "../models/entities/Player";
import { RoomSetting } from "../models/interface/RoomSetting";
class GameStore {
  private static _instance: GameStore | null;

  @observable
  private _gameState: GamestateEnum;

  @observable
  private _settings: RoomSetting;

  @observable
  private _players: Player[];

  @observable
  private _roomId: string;

  @observable
  private _me?: Player;

  @action
  public setGameState(gameState: GamestateEnum) {
    this._gameState = gameState;
  }

  @action
  public setMe(player: Player) {
    this._me = player;
  }

  @action
  public setSetting(setting: RoomSetting) {
    this._settings = setting;
  }

  @action
  public setPlayers(players: Player[]) {
    this._players = players;
  }

  @action
  public setRoomId(id: string) {
    this._roomId = id;
  }

  @computed
  public get setting(): RoomSetting {
    return this._settings;
  }

  @computed
  public get players(): Player[] {
    return this._players;
  }

  @computed
  public get roomId(): string {
    return this._roomId;
  }

  @computed
  public get gameState(): GamestateEnum {
    return this._gameState;
  }

  @computed
  public get me(): Player | undefined {
    return this._me;
  }

  private constructor() {
    this._gameState = GamestateEnum.NONE;
    this._settings = {
      total_rounds: 4,
      round_time: 60,
    };
    this._players = [];
    this._roomId = "";
    makeObservable(this);
  }

  public static getInstance(): GameStore {
    if (!GameStore._instance) {
      GameStore._instance = new GameStore();
    }
    return GameStore._instance;
  }
}

export const gameStore = GameStore.getInstance();
