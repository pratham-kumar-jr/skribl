import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import EventNotifier from "./components/EventNotifier";
import Players from "./components/Players";
import { GameStateEnum } from "./enums/GameState";
import { isLarge, isMedium, isSmall, useBreakPoint } from "./hooks/useBreakPoint";
import GamePage from "./pages/Game.Page";
import GameOverPage from "./pages/GameOver.Page";
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
  
  const [currentOption,setCurrentOption] = useState(0);
  const handleOption = (val:number)=>{
    if(val !==currentOption)
      setCurrentOption(val);
  }

  const breakPoint = useBreakPoint();

  return (
    <div className="h-screen overflow-hidden font-title">
      <div
        className={`h-full w-full font-title ${
          gameState !== GameStateEnum.START && "lg:pt-1/16"
        }`}
      >
        {gameState === GameStateEnum.NONE ? (
          <MainPage roomId={roomId}/>
        ) : (
           <>
            {gameState === GameStateEnum.LOBBY && <LobbyPage/>}
            {gameState === GameStateEnum.START && <GamePage currentOption={currentOption} handleOption={handleOption}/>}
            {(gameState === GameStateEnum.END) && <GameOverPage/>}
            <div className={`${gameState === GameStateEnum.START && ((isMedium(breakPoint) || isSmall(breakPoint) || isLarge(breakPoint) )? currentOption !== 0?" hidden ":" visible ":" visible ")}`}>
              <Players />
            </div>
            </>
        )}
      </div>
      {gameState === GameStateEnum.START && <EventNotifier/>}
    </div>
  );
};

App.defaultProps = {};

export default observer(App);
