import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Players from "./components/Players";
import { GameStateEnum } from "./enums/GameState";
import GamePage from "./pages/Game.Page";
import LobbyPage from "./pages/Lobby.Page";
import MainPage from "./pages/Main.Page";
import { gameStore } from "./store/GameStore";

interface Props {}

const App: React.FC<Props> = (props) => {
  const { gameState } = gameStore;
  const [roomId, setRoomId] = useState("");
  useEffect(() => {
    setRoomId(window.location.search.substring(1));
  }, []);

  return (
    <div className="h-screen overflow-hidden ">
      <div
        className={`h-full w-full font-title ${
          gameState !== GameStateEnum.START && "lg:pt-1/16"
        }`}
      >
        {gameState === GameStateEnum.NONE ? (
          <MainPage roomId={roomId}></MainPage>
        ) : (
          <>
            {gameState === GameStateEnum.LOBBY && <LobbyPage></LobbyPage>}
            {gameState === GameStateEnum.START && <GamePage></GamePage>}
            {/* {(gameState === GamestateEnum.END) && <GameOverPage></GameOverPage>} */}
            <Players />
          </>
        )}
      </div>
    </div>
  );
};

App.defaultProps = {};

export default observer(App);
