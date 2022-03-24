import { observer } from "mobx-react-lite";
import React from "react";
import { GameStateEnum } from "./enums/GameState";
import GamePage from "./pages/Game.Page";
import LobbyPage from "./pages/Lobby.Page";
import MainPage from "./pages/Main.Page";
import { gameStore } from "./store/GameStore";

interface Props {}

const App: React.FC<Props> = (props) => {
  
  const {gameState} = gameStore;
  console.log(gameState);

  return (
    <div className="p-2 h-screen bg-doodle bg-repeat-x bg-contain">
      <div className=" mt-6">
        {(gameState === GameStateEnum.NONE) && <MainPage></MainPage>}
        {(gameState === GameStateEnum.LOBBY) && <LobbyPage></LobbyPage>}
        {(gameState === GameStateEnum.START) && <GamePage></GamePage>}
        {/* {(gameState === GamestateEnum.END) && <GameOverPage></GameOverPage>} */}
      </div>
    </div>
  );
};

App.defaultProps = {};

export default observer(App);
