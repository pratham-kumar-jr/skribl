import { observer } from "mobx-react";
import React, { useCallback, useState } from "react";
import { roundService } from "../services/RoundService";
import store from "../store";
import Button from "./Button";
import Input from "./Input";
import {GrSend} from "react-icons/gr"

interface Props {}

const ChatArea: React.FC<Props> = (props) => {
  const [message, setMessage] = useState("");

  const { me,myChance } = store.gameStore;
  const handleOnChange = useCallback((event: any) => {
    if(!myChance)
      setMessage(event.target.value);
  }, [myChance]);

  const { chats } = store.chatStore;
 
  const sendMessage = () => {
    if (me && message.trim() !== '' && !myChance)  {
        store.chatStore.addChat({ by: me.name, message: message.trim() });
        roundService.chatClient(message.trim())
        setMessage('');
    }
  };

  return (
    <div className="border-2 border-black rounded-md h-full">
        <div className="text-xl h-3/4 lg:h-9/10 tracking-wider overflow-y-auto">
          {chats.map((chat) => (
            <p className="my-1 bg-gray-200 p-2 rounded-md opacity-75" key={chat.by+chat.message}>
              <span className=" text-green-700 mr-2 break-normal">
                {chat.by}
              </span>
              {chat.message}
            </p>
          ))}
        </div>
      <div className="lg:h-1/10 border-black border-t-2 rounded-md flex justify-between items-center px-2 ">
        <Input
          value={message}
          onChange={handleOnChange}
          placeholder={"Enter your message"}
        />
        <Button onClick={sendMessage} icon={GrSend} iconBorder={false}/>
      </div>
    </div>
  );
};

ChatArea.defaultProps = {};

export default observer(ChatArea);
