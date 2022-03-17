import React, { useState } from "react";
import Avator from "../components/Avator";
import Button from "../components/Button";
import DropDown from "../components/DropDown";
import { Player } from "../models/entities/Player";
import { gameService } from "../services/GameService";

interface Props {}

const LobbyPage: React.FC<Props> = (props) => {
  const [round, setRound] = useState(4);
  const [time, setTime] = useState(60);
  const [players, setPlayers] = useState<Player[]>([]);

  const roundOptions = Array(8)
    .fill(0)
    .map((_, index) => (
      <option value={index + 3} key={`round_${index + 3}`}>
        {index + 3}
      </option>
    ));

  const timeOptions = Array(8)
    .fill(45)
    .map((n, index) => (
      <>
        <option value={n + index * 15} key={`time_${n + index * 15}`}>
          {n + index * 15}
        </option>
      </>
    ));

  const handleStartGame = () => {
      gameService.onStartClient({
          players,
          round,
          time
      });
  };

  const handleRoundChange = (event: any) => {
    setRound(event.target.value);
  };

  const handleTimeChange = (event: any) => {
    setTime(event.target.value);
  };

  return (
    <div className="m-2 flex flex-row justify-around items-center">
      <div className=" w-96 flex flex-col">
        <h1 className="text-center text-2xl font-medium">Settings</h1>
        <DropDown
          id="rounds"
          title="No Of Rounds :"
          value={round}
          onChange={handleRoundChange}
        >
          {roundOptions}
        </DropDown>
        <DropDown
          id="time"
          title="Time Each Round :"
          value={time}
          onChange={handleTimeChange}
        >
          {timeOptions}
        </DropDown>

        <Button className="mx-auto my-2" onClick={handleStartGame}> Start Game</Button>
      </div>
      <div className="w-96 h-96 ">
        {players.map((player) => (
          <Avator name={player.name}></Avator>
        ))}
      </div>
    </div>
  );
};

LobbyPage.defaultProps = {};

export default React.memo(LobbyPage);
