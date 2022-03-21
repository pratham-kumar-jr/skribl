import { action, computed, makeObservable, observable, toJS } from "mobx";
import { GamestateEnum } from "../enums/GameState";
import { Player } from "../models/entities/Player";
import { RoomSetting } from "../models/interface/RoomSetting";
import * as _ from "lodash";
class GameStore {
  private static _instance: GameStore | null;

  @observable
  private _gameState: GamestateEnum;

  @observable
  private _settings: RoomSetting;

  @observable
  private _players: { [key: string]: Player };

  @observable
  private _roomId: string;

  @observable
  private _myId?: string;

  @action
  public setGameState(gameState: GamestateEnum) {
    this._gameState = gameState;
  }

  @action
  public setMe(playerID: string) {
    this._myId = playerID;
  }

  @action
  public setSetting(setting: RoomSetting) {
    this._settings = setting;
  }

  @action addPlayer(player: Player) {
    this._players[player.id] = player;
  }

  @action
  public removePlayer(playerId: string) {
    this._players = _.omit(this._players, playerId);
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
    const players = Object.values(this._players);
    return players;
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
  public get myId(): string | undefined {
    return this._myId;
  }

  public getPlayerById(playerId: string): Player {
    return this._players[playerId];
  }

  public get me(): Player | undefined {
    return this._players[this._myId || ""];
  }

  private constructor() {
    this._gameState = GamestateEnum.NONE;
    this._settings = {
      total_rounds: 4,
      round_time: 60,
    };
    this._players = {};
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
