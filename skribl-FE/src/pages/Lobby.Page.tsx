import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import Avator from "../components/Avator";
import Button from "../components/Button";
import DropDown from "../components/DropDown";
import { UserRole } from "../models/entities/Player";
import { gameService } from "../services/GameService";
import { gameStore } from "../store/GameStore";

interface Props {}

const LobbyPage: React.FC<Props> = (props) => {
  const {players,roomId,me,setting} = gameStore

  const disabled = me?.role === UserRole.JOINER;

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

  const handleStartGame = () => {};

  const handleRoundChange = (event: any) => {
    setting.total_rounds = +event.target.value;
  };

  const handleTimeChange = (event: any) => {
    setting.round_time = +event.target.value;
  };


  useEffect(()=>{
    gameService.roomSyncClient(setting);
  },[setting.round_time,setting.total_rounds,me?.role]);

  return (
    <div className="m-2 flex flex-row justify-around items-center">
      <div className=" w-96 flex flex-col">
        <h1 className="text-center text-2xl font-medium">Settings</h1>
        <DropDown
          id="rounds"
          title="No Of Rounds :"
          value={setting.total_rounds}
          onChange={handleRoundChange}
          disabled={disabled}
        >
          {roundOptions}
        </DropDown>
        <DropDown
          id="time"
          title="Time Each Round :"
          value={setting.round_time}
          onChange={handleTimeChange}
          disabled={disabled}
        >
          {timeOptions}
        </DropDown>

        <Button className="mx-auto my-2 " onClick={handleStartGame} disabled={disabled}> Start Game</Button>
        <h2 className=" mt-2 px-4 text-lg font-medium">Invite Link : {roomId} </h2>
      </div>
      <div className="w-96 h-96 flex justify-around flex-wrap ">
        {players.map((player) => (
          <Avator name={player.name}></Avator>
        ))}
      </div>
    </div>
  );
};

LobbyPage.defaultProps = {};

export default observer(LobbyPage);
