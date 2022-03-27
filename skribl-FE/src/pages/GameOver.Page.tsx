import { observer } from "mobx-react";
import React from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { UserRole } from "../models/entities/Player";
import { gameService } from "../services/GameService";
import store from "../store";

interface Props {}

const GameOverPage: React.FC<Props> = (props) => {
  const { topScorers,me } = store.gameStore;
  const disabled = me?.role === UserRole.JOINER;

    const handlePlayAgain = ()=>{
        gameService.roomSyncClient({new_game:true})
    }

  return (
    <div
      className="lg:w-4/5 lg:h-3/5 xl:h-3/5 xl:w-2/5 lg:mx-auto 
    lg:pt-1/20 xl:pt-1/50 flex  lg:border flex-col justify-start items-center 
    space-y-4 pt-1/5 md:pt-1/8 lg:shadow-lg rounded-md lg:border-black "
    >
      <Header>Skribble</Header>
      <div className="w-full px-4 text-2xl">
        <h2 className="text-center">Leader board</h2>
        <div className="flex justify-between">
          <h2 className=" underline">Position</h2>
          <h2 className=" text-green-700 underline">Player Name</h2>
          <h2 className="underline">Scores</h2>
        </div>
        {topScorers.map((player, index) => {
            const colorClass = index === 0 ? 
            "text-orange-400": index === 1?
            "text-blue-400": index === 2? 
            "text-green-400" : "text-black";
          return (
            <div className={`flex justify-between  ${colorClass} `} key={player.id}>
               <h2>{index+1}</h2>
              <h2>{player.name}</h2>
              <h2>{player.score}</h2>
            </div>
          );
        })}
      </div>
      <Button onClick={handlePlayAgain} disabled={disabled}>Play Again</Button>
    </div>
  );
};

GameOverPage.defaultProps = {};

export default observer(GameOverPage);
