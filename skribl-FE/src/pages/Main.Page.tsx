import React, { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import * as _ from "lodash";
import { gameService } from "../services/GameService";
import { gameStore } from "../store/GameStore";
import { UserRole } from "../models/entities/Player";
import Header from "../components/Header";
import Input from "../components/Input";
import {
  isLarge,
  isMedium,
  isSmall,
  useBreakPoint,
} from "../hooks/useBreakPoint";
import AvatarCanvasArea from "../components/AvatarCanvasArea";
import { canvasService } from "../services/CanvasService";
import { FiHelpCircle } from "react-icons/fi";
import { TiPencil } from "react-icons/ti";
import { BiEraser } from "react-icons/bi";
import { AiOutlineClear } from "react-icons/ai";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import store from "../store";
import { CursorTypeEnum } from "../enums/CursorTypeEnum";
import Character1 from "./../assests/characters/colored/C1.png";
import Character2 from "./../assests/characters/colored/C2.png";
import Character3 from "./../assests/characters/colored/C3.png";
import Character4 from "./../assests/characters/colored/C4.png";
import Character5 from "./../assests/characters/colored/C5.png";
import CharacterSelector from "../components/CharacterSelector";
interface Props {
  roomId: string;
}

const MainPage: React.FC<Props> = ({ roomId }) => {
  const [name, setName] = useState("");
  const [defaultavatar, setDefaultavatar] = useState(true);
  const [currentCharacter, setCurrentCharacter] = useState(Character1);

  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState(0);

  const breakPoint = useBreakPoint();
  const handleInput = (e: any) => {
    setName(e.target.value);
  };

  const handlePlay = () => {
    if (_.isEmpty(name)) return;
    if (_.isEmpty(roomId)) {
      gameService.createRoomClient({
        id: gameStore.myId || "",
        name: name,
        role: UserRole.CREATER,
        score: 0,
        avatar: defaultavatar ? "" : canvasService.canvasToUrl(),
      });
    } else {
      gameService.joinRoomClient(roomId, {
        id: gameStore.myId || "",
        name: name,
        role: UserRole.JOINER,
        score: 0,
        avatar: defaultavatar ? "" : canvasService.canvasToUrl(),
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

  const handleDefault = useCallback(() => {
    setDefaultavatar((t) => !t);
  }, []);

  useEffect(() => {
    if (!defaultavatar) {
      store.canvasStore.setCursor(CursorTypeEnum.PENCIL);
    }
  }, [defaultavatar]);
  const selectPencil = () => {
    setDefaultavatar(false);
    store.canvasStore.setCursor(CursorTypeEnum.PENCIL);
    setTool(0);
  };

  const selectEraser = () => {
    setTool(1);
    store.canvasStore.setCursor(CursorTypeEnum.ERASER);
  };

  const selectClear = () => {
    canvasService.clearCanvas();
    setTool(0);
    store.canvasStore.setCursor(CursorTypeEnum.PENCIL);
  };

  return (
    <div
      className="lg:w-4/5 lg:h-4/5 xl:h-2/3 xl:w-2/4 lg:mx-auto h-full 
  w-full p-2 shadow-lg rounded-md  bg-white bg-opacity-10
  lg:flex lg:flex-row lg:justify-start lg:items-stretch"
    >
      <div className="p-2 lg:h-full lg:w-2/5">
        <Header className="mx-auto lg:hidden">Skribble</Header>
        <div className=" p-2 w-full rounded-md">
          <div className="m-1 shadow-lg w-full md:w-1/2 mx-auto lg:w-full lg:h-3/5 rounded-xl h-72">
            <div
              className={`${
                defaultavatar ? "hidden" : ""
              } w-full bg-tertiary-2  h-80 rounded-xl `}
            >
              <AvatarCanvasArea
                tool={tool}
                drawing={drawing}
                setDrawing={setDrawing}
              />
            </div>
            <div
              className={`${
                !defaultavatar ? "hidden" : ""
              } w-full h-full bg-secondary-1 bg-opacity-60 rounded-xl `}
            >
              <img
                src={currentCharacter}
                className=" object-fill w-full h-80"
              />
            </div>
          </div>
          <div className=" flex space-x-2 p-1 justify-center">
            <Button icon={TiPencil} onClick={selectPencil} />
            <Button icon={BiEraser} onClick={selectEraser} />
            <Button icon={AiOutlineClear} onClick={selectClear} />
            <Button
              icon={GiPerspectiveDiceSixFacesRandom}
              onClick={handleDefault}
            />
          </div>
          <div className="mt-6 flex justify-start items-center md:w-1/2 w-full lg:w-full mx-auto space-x-2">
            <Input
              value={name}
              onChange={handleInput}
              onKeyDown={(e) => e.key === "Enter" && handlePlay()}
              placeholder={"Enter your name"}
              className={" border-2 border-primary rounded-md "}
            />
            {/* <Button icon={true} className={"flex-shrink-0"}>
              R
            </Button> */}
          </div>
        </div>
      </div>
      <div className=" lg:h-full w-3/5 p-2 relative">
        {!(
          isMedium(breakPoint) ||
          isLarge(breakPoint) ||
          isSmall(breakPoint)
        ) && <Header className="mx-auto">Skribble</Header>}
        <div className="lg:mt-12 mx-auto max-w-max ">
          <Button onClick={handlePlay}>Play</Button>
        </div>
        <CharacterSelector
          setCurrentCharacter={setCurrentCharacter}
          className={"absolute bottom-20 left-10"}
        >
          {[Character1, Character2, Character3, Character4, Character5]}
        </CharacterSelector>
        <Button icon={FiHelpCircle} className={`absolute bottom-3 right-3`} />
      </div>
    </div>
  );
};

MainPage.defaultProps = {};

export default React.memo(MainPage);
