import { observer } from "mobx-react";
import React, { useMemo } from "react";
import avatorImage from "../assests/avator.png";
import { GameStateEnum } from "../enums/GameState";
import store from "../store";
import Avator from "./Avator";

interface Props {}

const Players: React.FC<Props> = (props) => {
  const { topScorers: players, gameState } = store.gameStore;

  const memoPlayers = useMemo(() => {
    // return Array(8).fill(1).map((_,index)=>{
    //   return (
    //     <Avator
    //       name={"test"}
    //       pos={index}
    //       id={index+""}
    //       key={index}
    //       score={0}
    //       src={avatorImage}
    //     />
    //   );
    // });
    return players.map((player, index) => {
      let pos:number|undefined;
      if (gameState === GameStateEnum.END) {
        if (index === 0 || index === 1 || index === 2) {
          pos = index+1;
        }
      }
      return (
        <Avator
          name={player.name}
          pos={pos}
          id={player.id}
          key={player.id}
          score={player.score}
          src={player.avator || avatorImage}
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
