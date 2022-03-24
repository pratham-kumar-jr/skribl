import { observer } from "mobx-react";
import React from "react";
import CanvasGameArea from "../components/CanvasGameArea";
import List from "../components/List";
import store  from "../store"

interface Props {}

const GamePage: React.FC<Props> = (props) => {

  const {players} =  store.gameStore
  // const {chats} = store.chatStore

  return (
    <div className="flex space-x-4 px-16 h-screen border-4 border-white">
      <List className="w-1/4 bg-white  h-3/4 " title='Players' element={players}></List>
      <div className="w-1/2 bg-blue-300 h-3/4 p-2 border border-black">
        <CanvasGameArea />
      </div>
      {/* <List className="w-1/4 bg-white  h-3/4 " title='Chat' element={chats}></List> */}
    </div>
  );
};

GamePage.defaultProps = {};

export default observer(GamePage);
