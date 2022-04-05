import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Button from "../components/Button";
import DropDown from "../components/DropDown";
import Header from "../components/Header";
import { UserRole } from "../models/entities/Player";
import { gameService } from "../services/GameService";
import store from "../store";
import {FiShare2} from "react-icons/fi"

interface Props {}

const LobbyPage: React.FC<Props> = (props) => {
  const {  roomId, me, setting,players} = store.gameStore;

  const disabled = me?.role === UserRole.JOINER || players.length < 2;
  const roundOptions = Array(8)
    .fill(0)
    .map((_, index) => <option value={index + 3}>{index + 3}</option>);

  const timeOptions = Array(8)
    .fill(45)
    .map((n, index) => (
      <>
        <option value={n + index * 15}>{n + index * 15}</option>
      </>
    ));

  const handleStartGame = () => {
    gameService.startGameClient();
  };

  const handleRoundChange = (event: any) => {
    store.gameStore.setSetting({
      total_rounds: +event.target.value,
      round_time: setting.round_time,
    });
  };

  const handleTimeChange = (event: any) => {
    store.gameStore.setSetting({
      round_time: +event.target.value,
      total_rounds: setting.total_rounds,
    });
  };

  const handleCopy = ()=>{
    navigator.clipboard.writeText(window.location.host+"/?"+roomId)
  }

  useEffect(() => {
    if (me && me.role === UserRole.CREATER) gameService.roomSyncClient({settings:setting});
  }, [setting.round_time, setting.total_rounds, me?.role]);

  return (
   <>
   <div className="lg:w-4/5 lg:h-3/5 xl:h-3/5 xl:w-2/5 lg:mx-auto 
    lg:pt-1/20 xl:pt-1/50 flex  lg:border flex-col justify-start items-center 
   space-y-4 pt-1/3 md:pt-1/8 lg:shadow-lg rounded-md lg:border-black ">
     <Header className=" mt-1/20">Skribble</Header>
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
        <Button disabled={disabled} onClick={handleStartGame}>Start</Button>
        <div className="flex justify-center items-center">
        <h2 className=" mt-2 px-4 text-lg font-medium">Invite Link : <a href={`/?${roomId}`} target={"_blank"} className=" text-blue-400">{roomId}</a> </h2>
        <Button icon={FiShare2} onClick={handleCopy}/>
        </div>
      </div>
   </>
  );
};

LobbyPage.defaultProps = {};

export default observer(LobbyPage);
