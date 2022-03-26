import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import * as _ from "lodash";
import { gameService } from "../services/GameService";
import { gameStore } from "../store/GameStore";
import { UserRole } from "../models/entities/Player";
import Header from "../components/Header";
import Input from "../components/Input";
import { useBreakPoint } from "../hooks/useBreakPoint";

interface Props {
  roomId: string;
}

const MainPage: React.FC<Props> = ({ roomId }) => {
  const [name, setName] = useState("");
  const breakPoint = useBreakPoint();
  const handleInput = (e: any) => {
    setName(e.target.value);
  };

  const handlePlay = () => {
    if (_.isEmpty(name)) return;
    if(_.isEmpty(roomId)){
      gameService.createRoomClient({
        id: gameStore.myId || "",
        name: name,
        role: UserRole.CREATER,
        score: 0,
      });
    }else{
      gameService.joinRoomClient(roomId, {
        id: gameStore.myId || "",
        name: name,
        role: UserRole.JOINER,
        score: 0,
      });  
    }
  };

  useEffect(() => {
    if (_.isEmpty(roomId)) return;
    if (_.isEmpty(name)) return;
    gameService.joinRoomClient(roomId, {
      id: gameStore.myId || "",
      name: name,
      role: UserRole.JOINER,
      score: 0,
    });
  }, []);

  return (
    <div
      className="lg:w-4/5 lg:h-4/5 xl:h-2/3 xl:w-2/4 lg:mx-auto h-full 
  w-full p-2  border shadow-lg rounded-md border-black 
  lg:flex lg:flex-row lg:justify-start lg:items-stretch"
    >
      <div className="xl:w-2/6 lg:w-2/5 p-2 h-4/6 lg:h-full">
        <Header className="mx-auto lg:hidden">Skribble</Header>
        <h2 className="text-center my-2 text-xl">Draw your Avator</h2>
        <div className=" border-2 p-2 h-5/6 border-black rounded-md">
          <div className="m-1 border-2  border-black w-full md:w-1/2 mx-auto h-4/6 lg:w-full lg:h-3/5 rounded-md">
            Canvas
          </div>
          <div className=" flex space-x-2 p-1 justify-center">
            <Button icon={true}>L</Button>
            <Button icon={true}>R</Button>
            <Button icon={true}>D</Button>
          </div>
          <div className="mt-6 flex justify-start items-center md:w-1/2 w-full lg:w-full mx-auto space-x-2">
            <Input
              value={name}
              onChange={handleInput}
              placeholder={"Enter your name"}
              className={" border-2 border-black rounded-md "}
            />
            <Button icon={true} className={"flex-shrink-0"}>
              R
            </Button>
          </div>
        </div>
      </div>
      <div className="lg:w-4/6 p-2 relative">
        {breakPoint !== "md" && breakPoint !== "sm" && breakPoint !== "lg" && (
          <Header className="mx-auto">Skribble</Header>
        )}
        <Button onClick={handlePlay} className="mt-6 ml-4">Play</Button>
        <Button icon={true} className={`absolute bottom-3 right-3`}>
          Help
        </Button>
      </div>
    </div>
  );
};

MainPage.defaultProps = {};

export default React.memo(MainPage);
