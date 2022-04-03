import { observer } from "mobx-react";
import React from "react";
import store from "../store";

interface Props {}

const LearderBoard: React.FC<Props> = (props) => {
  const { topScorers } = store.gameStore;
  return (
    <div className="w-full px-4 text-2xl lg:text-lg h-56 lg:max-h-max overflow-y-auto">
      <h2 className="text-center">Leader board</h2>
      <div className="flex justify-between">
        <h2 className=" underline">Position</h2>
        <h2 className=" text-green-700 underline">Name</h2>
        <h2 className="underline">Scores</h2>
      </div>
      {topScorers.map((player, index) => {
        const colorClass =
          index === 0
            ? "text-orange-400"
            : index === 1
            ? "text-blue-400"
            : index === 2
            ? "text-green-400"
            : "text-black";
        return (
          <div
            className={`flex justify-between ${colorClass} `}
            key={player.id}
          >
            <h2>{index + 1}</h2>
            <h2>{player.name}</h2>
            <h2>{player.score}</h2>
          </div>
        );
      })}
    </div>
  );
};

LearderBoard.defaultProps = {};

export default observer(LearderBoard);
