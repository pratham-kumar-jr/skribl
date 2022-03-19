import { observer } from "mobx-react-lite";
import React from "react";
import { GamestateEnum } from "./enums/GameState";
import LobbyPage from "./pages/Lobby.Page";
import MainPage from "./pages/Main.Page";
import { gameStore } from "./store/GameStore";

interface Props {}

const App: React.FC<Props> = (props) => {
  
  const {gameState} = gameStore;
  console.log(gameState);

  return (
    <div className="p-2 h-screen bg-doodle bg-repeat-x bg-contain">
      <div className=" mt-80">
        {(gameState === GamestateEnum.NONE) && <MainPage></MainPage>}
        {(gameState === GamestateEnum.LOBBY) && <LobbyPage></LobbyPage>}
        {/* {(gameState === GamestateEnum.START) && <GamePage></GamePage>}
        {(gameState === GamestateEnum.END) && <GameOverPage></GameOverPage>} */}
      </div>
    </div>
  );
};

App.defaultProps = {};

export default observer(App);
