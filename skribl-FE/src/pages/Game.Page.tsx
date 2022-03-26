import React from "react";
import CanvasGameArea from "../components/CanvasGameArea";
import ChatArea from "../components/ChatArea";
import GameInfoArea from "../components/GameInfoArea";

interface Props {}

const GamePage: React.FC<Props> = (props) => {
  return (
    <div className="h-full w-full border border-black p-4 flex space-x-2">
      <div className=" w-1/4 p-2 h-4/6">
        <GameInfoArea />
      </div>
      <div className="w-1/2 p-2 h-4/6">
        <CanvasGameArea />
      </div>
      <div className="w-1/4 p-2 h-4/6">
        <ChatArea/>  
      </div>
    </div>
  );
};

GamePage.defaultProps = {};

export default React.memo(GamePage);
