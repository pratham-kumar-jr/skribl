import { action, computed, makeObservable, observable } from "mobx";
import { GameStateEnum } from "../enums/GameState";
import { Player } from "../models/entities/Player";
import { RoomSetting } from "../models/interface/RoomSetting";
import * as _ from "lodash";
class GameStore {
  private static _instance: GameStore | null;

  @observable
  private _gameState: GameStateEnum;

  @observable
  private _currentWord: string | undefined;

  @observable
  private _settings: RoomSetting;

  @observable
  private _players: { [key: string]: Player };

  @observable
  private _roomId: string;

  @observable
  private _myId?: string;

  @observable
  private _currentPlayerId?: string;

  @observable
  private _round: number;

  @observable
  private _choosing: boolean;

  @observable
  private _wordList: string[];

  @observable
  private _guessedPlayerId?: string;

  @observable
  private _timeLeft: number;

  @observable
  private _roundStart: boolean;

  @observable
  private _wordLength?: number;

  @action
  public setTimeLeft(timeLeft: number) {
    this._timeLeft = timeLeft;
  }

  @action
  public setWordLength(length: number) {
    this._wordLength = length;
  }

  @computed
  public get timeLeft(): number {
    return this._timeLeft;
  }

  @computed
  public get roundStart(): boolean {
    return this._roundStart;
  }

  @computed
  public get wordLength(): number | undefined {
    return this._wordLength;
  }

  @action
  public setGuessedPlayerId(playerId: string) {
    this._guessedPlayerId = playerId;
  }

  @computed
  public get guessedPlayerId(): string | undefined {
    return this._guessedPlayerId;
  }

  @action
  public setWordList(words: string[]) {
    this._wordList = words;
  }

  @action
  public setChoosing(state: boolean) {
    this._choosing = state;
  }

  @computed
  public get choosing(): boolean {
    return this._choosing;
  }

  @action
  public setCurrentPlayerId(playerId: string) {
    this._currentPlayerId = playerId;
  }

  @action
  public setCurrentWord(word?: string) {
    this._currentWord = word;
  }

  @computed
  public get currentWord(): string | undefined {
    return this._currentWord;
  }

  @computed
  public get currentPlayerId(): string | undefined {
    return this._currentPlayerId;
  }

  @computed
  public get wordList(): string[] {
    return this._wordList;
  }

  @action
  public setGameState(gameState: GameStateEnum) {
    this._gameState = gameState;
  }

  @action
  public setRoundStart(roundStart: boolean) {
    this._roundStart = roundStart;
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
  public setRound(round: number) {
    this._round = round;
  }

  @computed
  public get round(): number {
    return this._round;
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
  public get gameState(): GameStateEnum {
    return this._gameState;
  }

  @computed
  public get myId(): string | undefined {
    return this._myId;
  }

  public getPlayerById(playerId: string): Player {
    return this._players[playerId];
  }

  @computed
  public get me(): Player | undefined {
    return this._players[this._myId || ""];
  }

  @action
  public setScores(scores: { [playerId: string]: number }) {
    this.players.forEach((p) => {
      p.score = scores[p.id];
    });
  }

  @action
  public setScore(playerId: string, score: number) {
    this._players[playerId].score = score;
  }

  public get topScorers(): Player[] {
    const tops = this.players.sort((p1, p2) =>
      p1.score < p2.score ? 1 : p1.score == p2.score ? 0 : -1
    );
    return tops;
  }

  private constructor() {
    this._gameState = GameStateEnum.NONE;
    this._settings = {
      total_rounds: 4,
      round_time: 60,
    };
    this._players = {};
    this._roomId = "";
    this._choosing = false;
    this._round = 1;
    this._timeLeft = this._settings.round_time;
    this._wordList = [];
    this._roundStart = false;
    makeObservable(this);
  }

  @computed
  public get myChance(): boolean {
    return this._myId !== undefined && this._currentPlayerId === this.myId;
  }

  public static getInstance(): GameStore {
    if (!GameStore._instance) {
      GameStore._instance = new GameStore();
    }
    return GameStore._instance;
  }
}

export const gameStore = GameStore.getInstance();
