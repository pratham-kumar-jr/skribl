import React, { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import * as _ from "lodash";
import { gameService } from "../services/GameService";
import { gameStore } from "../store/GameStore";
import { UserRole } from "../models/entities/Player";
import Header from "../components/Header";
import Input from "../components/Input";
import { isLarge, isMedium, isSmall, useBreakPoint } from "../hooks/useBreakPoint";
import AvatorCanvasArea from "../components/AvatorCanvasArea";
import avatorImage from "../assests/avator.png";
import { canvasService } from "../services/CanvasService";
interface Props {
  roomId: string;
}

const MainPage: React.FC<Props> = ({ roomId }) => {
  const [name, setName] = useState("");
  const [defaultAvator,setDefaultAvator] = useState(true);

  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState(0);


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
        avator: defaultAvator? "" :canvasService.canvasToUrl()
      });
    }else{
      gameService.joinRoomClient(roomId, {
        id: gameStore.myId || "",
        name: name,
        role: UserRole.JOINER,
        score: 0,
        avator: defaultAvator? "" :canvasService.canvasToUrl()
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

  const handleDefault = useCallback(()=>{
    setDefaultAvator(t=>!t)
  },[])

  const selectPencil = () => {
    setTool(0);
  };

  const selectEraser = () => {
    setTool(1);
  };

  const selectClear = () => {
    canvasService.clearCanvas();
    setTool(0);
  };

  return (
    <div
      className="lg:w-4/5 lg:h-4/5 xl:h-2/3 xl:w-2/4 lg:mx-auto h-full 
  w-full p-2  border shadow-lg rounded-md border-black 
  lg:flex lg:flex-row lg:justify-start lg:items-stretch"
    >
      <div className="xl:w-2/6 lg:w-2/5 p-2 h-4/6 lg:h-full">
        <Header className="mx-auto lg:hidden">Skribble</Header>
        <h2 className="text-center my-2 text-xl">Draw your Avator</h2>
        <div className=" border-2 p-2 h-4/6 lg:h-5/6 border-black rounded-md">
          <div className="m-1 border-2 border-black w-full md:w-1/2 mx-auto h-4/6 lg:w-full lg:h-3/5 rounded-md">
            <div className={`${defaultAvator ? "hidden" : ""} w-full h-full`}>
              <AvatorCanvasArea tool={tool} drawing={drawing} setDrawing={setDrawing}/>
            </div>
            <div className={`${!defaultAvator ? "hidden":""} w-full h-full`}>
              <img src={avatorImage} className="object-fit w-full h-full"></img>
            </div>
          </div>
          <div className=" flex space-x-2 p-1 justify-center">
            <Button icon={true} onClick={selectPencil}>P</Button>
            <Button icon={true} onClick={selectEraser}>E</Button>
            <Button icon={true} onClick={selectClear}>C</Button>
            <Button icon={true} onClick={handleDefault}>D</Button>
          </div>
          <div className="mt-6 flex justify-start items-center md:w-1/2 w-full lg:w-full mx-auto space-x-2">
            <Input
              value={name}
              onChange={handleInput}
              placeholder={"Enter your name"}
              className={" border-2 border-black rounded-md "}
            />
            {/* <Button icon={true} className={"flex-shrink-0"}>
              R
            </Button> */}
          </div>
        </div>
      </div>
      <div className="lg:w-4/6 h-2/6 lg:h-full  p-2 relative">
        {!(isMedium(breakPoint) || isLarge(breakPoint) || isSmall(breakPoint))  && (
          <Header className="mx-auto">Skribble</Header>
        )}
        <div className="lg:mt-6 mx-auto max-w-max lg:ml-4">
        <Button onClick={handlePlay}>Play</Button>
        </div>
        <Button icon={true} className={`absolute bottom-3 right-3`}>
          H
        </Button>
      </div>
    </div>
  );
};

MainPage.defaultProps = {};

export default React.memo(MainPage);
