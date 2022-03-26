import { observer } from "mobx-react";
import React from "react";
import avatorImage from "../assests/avator.png"
import store from "../store";
import Avator from "./Avator";

interface Props {}

const Players: React.FC<Props> = (props) => {

    const {players} = store.gameStore
  return (
    <div className="fixed h-1/5 w-full bottom-0 overflow-x-auto flex 
    overflow-y-hidden items-baseline justify-center"
   >
      {players
        .map((player) => {
          return (
            <Avator name={player.name} id={player.id} key={player.id} score={player.score} src={avatorImage} ></Avator>
          );
        })}
    </div>
  );
};

Players.defaultProps = {};

export default observer(Players);
