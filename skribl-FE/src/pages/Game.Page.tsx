import React from "react";
import CanvasGameArea from "../components/CanvasGameArea";
import List from "../components/List";

interface Props {}

const GamePage: React.FC<Props> = (props) => {
  return (
    <div className="flex space-x-4 px-16 h-screen border-4 border-white">
      <List className="w-1/4 bg-white  h-3/4 " title='Players'></List>
      <div className="w-1/2 bg-blue-300 h-3/4 p-2 border border-black">
        <CanvasGameArea />
      </div>
      <List className="w-1/4 bg-white  h-3/4 " title='Chat'></List>
    </div>
  );
};

GamePage.defaultProps = {};

export default React.memo(GamePage);
