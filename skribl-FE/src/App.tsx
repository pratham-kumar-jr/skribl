import React from "react";
import LobbyPage from "./pages/Lobby.Page";
import MainPage from "./pages/Main.Page";

interface Props {}

const App: React.FC<Props> = (props) => {
  return (
    <div className="p-2 h-screen bg-doodle bg-repeat-x bg-contain">
      <div className=" mt-80">
        <MainPage />
      </div>
    </div>
  );
};

App.defaultProps = {};

export default React.memo(App);
