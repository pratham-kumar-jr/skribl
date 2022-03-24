import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Avator from "../components/Avator";
import Button from "../components/Button";
import DropDown from "../components/DropDown";
import { UserRole } from "../models/entities/Player";
import { gameService } from "../services/GameService";
import store from "../store"

interface Props {}

const LobbyPage: React.FC<Props> = (props) => {
  const {players,roomId,me,setting} = store.gameStore

  const disabled = me?.role === UserRole.JOINER;
  const roundOptions = Array(8)
    .fill(0)
    .map((_, index) => (
      <option value={index + 3}>
        {index + 3}
      </option>
    ));

  const timeOptions = Array(8)
    .fill(45)
    .map((n, index) => (
      <>
        <option value={n + index * 15}>
          {n + index * 15}
        </option>
      </>
    ));

  const handleStartGame = () => {
    gameService.startGameClient();
  };

  const handleRoundChange = (event: any) => {
    store.gameStore.setSetting({total_rounds:+event.target.value,round_time:setting.round_time})
  };

  const handleTimeChange = (event: any) => {
    store.gameStore.setSetting({round_time:+event.target.value,total_rounds:setting.total_rounds})
  };


  useEffect(()=>{
    if(me && me.role === UserRole.CREATER)
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
          <Avator name={player.name} key={player.id}></Avator>
        ))}
      </div>
    </div>
  );
};

LobbyPage.defaultProps = {};

export default observer(LobbyPage);
