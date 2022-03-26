import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { Player } from "../models/entities/Player";
import { roundService } from "../services/RoundService";
import store from "../store";
import Button from "./Button";
import Header from "./Header";

interface Props {}

const min = (a: number, b: number) => {
  return a > b ? b : a;
};

const GameInfoArea: React.FC<Props> = (props) => {
  const {
    round,
    currentPlayerId,
    timeLeft,
    topScorers,
    choosing,
    myChance,
    wordList,
  } = store.gameStore;
  const drawer = store.gameStore.getPlayerById(currentPlayerId!);

  const firstThreePlayers: Player[] = [];

  for (let i = 0; i < min(3, topScorers.length); i++) {
    firstThreePlayers.push(topScorers[i]);
  }

  const memorizedWord = useMemo(()=>{
    return wordList.map((word) => (
      <Button onClick={()=>{
        roundService.roundSyncClient(word);
      }} key={word}>{word}</Button>
    ))
  },[myChance,choosing,wordList])
  return (
    <>
      <Header className=" text-5xl"> Skribble</Header>
      <div className="border-2 mt-2  border-black rounded-md p-2 text-xl">
        <h2>Round :- {round}</h2>
        <h2>Drawer :- {drawer ? drawer.name : ""}</h2>
        <h2>Timer :- {timeLeft}</h2>
      </div>
      <div className="border-2 mt-2 border-black rounded-md p-2 text-xl">
        <h2 className="text-center">Top Scorers</h2>
        <div className="flex justify-between">
              <h2 className=" text-green-700 underline">Player Name</h2>
              <h2 className="underline">Scores</h2>
            </div>
        {firstThreePlayers.map((player) => (
            <div className="flex justify-between" key={player.id}>
              <h2 className=" text-green-700">{player.name}</h2>
              <h2>{player.score}</h2>
            </div>
        ))}
      </div>

      <div className="border-2 mt-2 border-black rounded-md p-2 text-xl text-center ">
        <h2>Events</h2>
        <h2>
          {choosing ? (
            <span>
              <span className="text-green-700">{drawer?.name}</span> is choosing
              a word
            </span>
          ) : (
            <span>
              <span className="text-green-700">{drawer?.name}</span> have chosen
              a word
            </span>
          )}
          {choosing && myChance && (
            <div className="mt-2 flex flex-col items-center space-y-4">
              {memorizedWord}
            </div>
          )}
        </h2>
      </div>
    </>
  );
};

GameInfoArea.defaultProps = {};

export default observer(GameInfoArea);
