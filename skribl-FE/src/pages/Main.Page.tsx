import React, { useState } from "react";
import Button from "../components/Button";
import * as _ from "lodash"
import { gameService } from "../services/GameService";
import { gameStore } from "../store/GameStore";
import { UserRole } from "../models/entities/Player";

interface Props {}

const MainPage: React.FC<Props> = (props) => {
  const [name, setName] = useState("");
  const [roomId,setRoomId] = useState('');

  const handleInput = (e: any) => {
    setName(e.target.value);
  };

  const handleRoomIdInput = (e:any)=>{
    setRoomId(e.target.value);
  }

  const handleCreateRoom = ()=>{
    if(_.isEmpty(name)) return;
    gameService.createRoomClient({id:gameStore.me?.id || '',name:name,role:UserRole.CREATER})
  }

  const handleJoinRoom = ()=>{
    if(_.isEmpty(roomId) || roomId.length !== 8) return;
    if(_.isEmpty(name)) return;
    gameService.joinRoomClient(roomId,{id:gameStore.me?.id||'',name:name,role:UserRole.JOINER})
  }

  return (
    <div className=" w-1/4 h-max mx-auto p-6 rounded-md bg-transparent">
      <div className="border-2 border-x-pink-400  border-y-blue-400 border-opacity-80   rounded-md mx-auto w-40 h-40 text-center">
        Image
      </div>
      <div className="border-2 border-x-pink-400  border-y-blue-400 border-opacity-80   rounded-md mx-auto w-40 mt-2 h-12">
        <input
          value={name}
          onChange={handleInput}
          type={"text"}
          className=" bg-transparent mx-1 h-full w-full focus:outline-none"
          placeholder="Enter your Name"
        />
      </div>
      <div className=" flex flex-col justify-center place-items-center mt-2 space-y-4">
        <Button onClick={handleCreateRoom}>Create Room</Button>
        <Button onClick={handleJoinRoom}>Join Room</Button>
      </div>
      <div className="border-2 border-x-pink-400  border-y-blue-400 border-opacity-80   rounded-md mx-auto w-40 mt-2 h-12">
        <input
          value={roomId}
          onChange={handleRoomIdInput}
          type={"text"}
          className=" bg-transparent mx-1 h-full w-full focus:outline-none"
          placeholder="Enter Room Id"
        />
      </div>
    </div>
  );
};

MainPage.defaultProps = {};

export default React.memo(MainPage);
