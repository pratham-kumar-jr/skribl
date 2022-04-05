import React from "react";
import CanvasGameArea from "../components/CanvasGameArea";
import ChatArea from "../components/ChatArea";
import GameInfoArea from "../components/GameInfoArea";
import LearderBoard from "../components/LearderBoard";
import { isLarge, isMedium, isSmall, useBreakPoint } from "../hooks/useBreakPoint";

interface Props {
  currentOption: number;
  handleOption: (val: number) => void;
}

const GamePage: React.FC<Props> = ({ handleOption, currentOption }) => {
  const breakpoint = useBreakPoint();
  return (
    <div className="h-full w-full border-2 border-black lg:p-4 lg:flex">
      <div className="lg:w-1/4 p-2 lg:h-4/5">
        <GameInfoArea
          currentOption={currentOption}
          handleOption={handleOption}
        />
      </div>
      <div className="w-9/10 ml-auto p-2 h-4/6 lg:h-4/5 lg:w-1/2">
        <CanvasGameArea />
      </div>
      <div
        className={`lg:w-1/4 ml-auto w-9/10 p-2 h-56 lg:h-4/5 ${
          (isSmall(breakpoint) || isMedium(breakpoint) || isLarge(breakpoint)) && currentOption !== 1
            ? "hidden"
            : "visible"
        }`}
      >
        <ChatArea />
      </div>
      <div
        className={`lg:w-1/4 ml-auto w-9/10 p-2 h-56 ${
          (isSmall(breakpoint) || isMedium(breakpoint) || isLarge(breakpoint))? currentOption !== 2
            ? "hidden"
            : "visible"
            :"hidden"
        }`}
      >
        <LearderBoard />
      </div>
    </div>
  );
};

GamePage.defaultProps = {};

export default React.memo(GamePage);
