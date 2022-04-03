import { observer } from "mobx-react";
import React from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import LearderBoard from "../components/LearderBoard";
import { UserRole } from "../models/entities/Player";
import { gameService } from "../services/GameService";
import store from "../store";

interface Props {}

const GameOverPage: React.FC<Props> = (props) => {
  const { me } = store.gameStore;
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
      <LearderBoard/>
      <Button onClick={handlePlayAgain} disabled={disabled}>Play Again</Button>
    </div>
  );
};

GameOverPage.defaultProps = {};

export default observer(GameOverPage);
