import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { options } from "../Helper/TabOptions";
import { isLarge, isMedium, isSmall, useBreakPoint } from "../hooks/useBreakPoint";
import { roundService } from "../services/RoundService";
import store from "../store";
import Header from "./Header";
import Timer from "./Timer";
import LearderBoard from "./LearderBoard";
interface Props {
  currentOption:number,
  handleOption:(val:number)=>void;
}

const GameInfoArea: React.FC<Props> = ({currentOption,handleOption}) => {
  const {
    round,
    currentPlayerId,
    roundStart,
    setting,
    wordLength,
    myChance,
    choosing,
  } = store.gameStore;
  const drawer = store.gameStore.getPlayerById(currentPlayerId!);

  const onTimerEnd = () => {
    roundService.wordRevealClient();
  };

  const breakpoint = useBreakPoint();
  return (
    <>
      <div className="flex items-center lg:flex-col lg:w-full lg:h-full">
        <Header size="text-2xl lg:text-5xl"> Skribble</Header>
        <div className="flex text-xl flex-wrap w-full lg:flex-col lg:space-x-0 lg:border-2
         lg:p-2  justify-center lg:border-black lg:rounded-md space-x-4">
          <h2>Round :- {round}</h2>
          {breakpoint !== "sm" && breakpoint !== "md" && (
            <h2>Drawer :- {drawer ? drawer.name : ""}</h2>
            )}
          <Timer
            start={setting.round_time}
            onTimerEnd={onTimerEnd}
            stop={!roundStart}
            reset={!roundStart}
            />
            {!myChance && !choosing && <h2> Word :- {Array(wordLength || 4).fill("_").join(" ")}</h2>}
        </div>
        <div className={`w-full ${isSmall(breakpoint) || isMedium(breakpoint) || isLarge(breakpoint)?"hidden":"visible"}`}>
          <LearderBoard/>
        </div>
      </div>
      { (isSmall(breakpoint) || isMedium(breakpoint) || isLarge(breakpoint)) &&
        <div className="flex flex-col fixed py-4 pr-2 h-3/5 top-1/5 w-10  text-xl">
        {options.map((op,index) => {
          return (
            <div
              className={`${currentOption === index && " text-2xl  bg-gray-200" } text-center border h-full w-full cursor-pointer ${index === 0 ? "rounded-t-full":index === options.length-1 ? "rounded-b-full":""} border-black`}
              style={{
                textOrientation: "sideways",
                writingMode: "vertical-lr",
              }}
            >
              <h2 onClick={()=>{handleOption(index)}}>{op}</h2>
            </div>
          );
        })}
      </div>
      }
    </>
  );
};

GameInfoArea.defaultProps = {};

export default observer(GameInfoArea);
