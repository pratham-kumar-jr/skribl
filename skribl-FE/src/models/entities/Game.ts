import { GamestateEnum } from "../../enums/GameState";
import { RoomSetting } from "../interface/RoomSetting";
import { Player } from "./Player";

export interface Game {
  game_state: GamestateEnum;
  settings?: RoomSetting;
  players?: Player[];
  room_id?: string;
}
