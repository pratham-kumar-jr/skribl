import * as _ from "lodash";
import moment from "moment";
import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/PlayerDTO";
import { mapService } from "../service/MapService";
import Player from "./Player";
import BaseSchema from "./_base";
export interface RoomSetting {
  total_rounds: number;
  round_time: number;
}

class Room extends BaseSchema {
  private _players: string[];
  private _curentRound: number;
  private _roundStartTime: number;
  private _currentPlayerIndex: number;
  private _scores: { [key: string]: number };
  private _currentWord: string;
  private _guessedPlayer: string[];
  private _gameStarted: boolean;
  private _chanceCount: number;

  public constructor(id: string, private _roomSetting: RoomSetting) {
    super(id);
    this._players = [];
    this._curentRound = 1;
    this._roundStartTime = moment.now();
    this._scores = {};
    this._currentWord = "";
    this._currentPlayerIndex = 0;
    this._guessedPlayer = [];
    this._gameStarted = false;
    this._chanceCount = 1;
    this._updateCache();
  }

  private _updateCache() {
    mapService.setEntity<Room>(this.id, this);
  }

  public get chanceCount(): number {
    return this._chanceCount;
  }

  public setChanceCount(count: number) {
    this._chanceCount = count;
  }

  public resetScore() {
    for (const playerId of this.players) {
      this._scores[playerId] = 0;
    }
    this._updateCache();
  }

  public getGuessPlayerCount(): number {
    return this._guessedPlayer.length;
  }

  public updateCurrentRound(round: number) {
    this._curentRound = round;
    this._updateCache();
  }

  public isFinalOver(): boolean {
    return this._curentRound >= this._roomSetting.total_rounds;
  }

  public get timeElapsed(): number {
    return Math.floor((moment.now() - this._roundStartTime) / 1000);
  }

  public isAlreadyGuessed(playerId: string): boolean {
    return this._guessedPlayer.includes(playerId);
  }

  public markPlayerGuessed(playerId: string) {
    this._guessedPlayer.push(playerId);
    mapService.setEntity<Room>(this.id, this);
  }

  public updateToNextPlayer() {
    this._currentPlayerIndex++;
    this._currentPlayerIndex = this._currentPlayerIndex % this._players.length;
    this._updateCache();
  }

  public get currentRound(): number {
    return this._curentRound;
  }

  public setCurrentPlayerIndex(idx: number) {
    this._currentPlayerIndex = idx;
    this._updateCache();
  }

  public get scores(): {
    [key: string]: number;
  } {
    return this._scores;
  }

  public addPlayer(socket: Socket, playerPayload: PlayerDTO): Player {
    const player = new Player(
      socket,
      playerPayload.name,
      playerPayload.role!,
      playerPayload.avatar
    );
    player.joinRoom(this.id);
    this._players.push(player.id);
    this._updateCache();
    return player;
  }

  public get roomSetting(): RoomSetting {
    return this._roomSetting;
  }

  public updateSetting(setting: RoomSetting) {
    this._roomSetting = setting;
    this._updateCache();
  }

  public get players(): string[] {
    return this._players;
  }

  public checkGuessWord(word: string) {
    return this._currentWord === word;
  }

  public setCurrenWord(word: string) {
    this._currentWord = word;
    this._updateCache();
  }

  public get currentPlayerIndex(): number {
    return this._currentPlayerIndex;
  }

  public get currentWord(): string {
    return this._currentWord;
  }

  public changeScore(playerId: string, score: number) {
    this._scores[playerId] = score;
    this._updateCache();
  }

  public removePlayer(playerId: string) {
    if (playerId.length === 0) {
      console.log("[Room] Empty Room");
      return;
    }
    const pos = this.players.indexOf(playerId);
    if (pos < 0 || pos >= this._players.length) {
      console.log("[Room] Player Does not exist");
      return;
    }

    this._scores = _.omit(this._scores, this._players[pos]);
    this._players[pos] = this._players[this._players.length - 1];
    this._players.pop();
    this._updateCache();
  }

  public resetRound() {
    this._roundStartTime = moment.now();
    this._guessedPlayer = [];
    this._updateCache();
  }

  public setGameStarted(start: boolean) {
    this._gameStarted = start;
    this._updateCache();
  }

  public get gameStarted(): boolean {
    return this._gameStarted;
  }
}

export default Room;
