import { observer } from "mobx-react";
import React, { ImgHTMLAttributes, useMemo } from "react";
import { GameStateEnum } from "../enums/GameState";
import store from "../store";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  name: string;
  score: number;
  id:string;
}

const Avator: React.FC<Props> = ({ name, src,score,id }) => {
  const {gameState,myId} = store.gameStore;
  
  const myAvator = useMemo(()=>{return myId === id},[myId]);

  return (
    <div className=" h-full w-36 relative flex-shrink-0 hover:scale-110">
      <img src={src} className="absolute bottom-0 right-0 left-0 w-full hover:bottom-2" />
      <div className={`absolute text-center w-24 bottom-1 bg-white rounded-lg opacity-80 
      shadow-lg left-4 text-lg ${myAvator ? 'text-purple-500': 'text-black'}`}>
      <h1>{name}</h1>
      {gameState !== GameStateEnum.LOBBY && <h1 >Score :- {score}</h1>}
      </div>
    </div>
  );
};

Avator.defaultProps = {
};

export default observer(Avator);
