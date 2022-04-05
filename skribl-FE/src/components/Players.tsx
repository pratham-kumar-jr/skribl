import { observer } from "mobx-react";
import React, { useMemo } from "react";
import avatarImage from "../assests/avatar.png";
import { GameStateEnum } from "../enums/GameState";
import store from "../store";
import Avatar from "./Avatar";

interface Props {}

const Players: React.FC<Props> = (props) => {
  const { topScorers: players, gameState } = store.gameStore;

  const memoPlayers = useMemo(() => {
    return players.map((player, index) => {
      let pos:number|undefined;
      if (gameState === GameStateEnum.END) {
        if (index === 0 || index === 1 || index === 2) {
          pos = index+1;
        }
      }
      return (
        <Avatar
          name={player.name}
          pos={pos}
          id={player.id}
          key={player.id}
          score={player.score}
          src={player.avatar || avatarImage}
        />
      );
    })}
      , [gameState, players]);

  return (
    <div
      className="fixed h-1/5 w-full bottom-0 overflow-x-auto flex 
    overflow-y-hidden items-baseline justify-center"
    >
      {memoPlayers}
    </div>
  );
};

Players.defaultProps = {};

export default observer(Players);
