import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import ContainerRoomChat from "./chat-room/ContainerRoomChat";
import "./chatRoom.css";
import ListRoomChat from "./ListRoomChat/ListRoomChat";

export type SelectedRoom = {
  name: string;
  description: string;
  members: string[];
  id: string;
};

const RoomChat = () => {
  const { path, url } = useRouteMatch();

  console.log(path, url);

  const [showRoomChat, setShowRoomChat] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | undefined>(
    undefined
  );
  const [members, setMembers] = useState<any[]>([]);

  return (
    <div className="container max-width-100">
      <div className="row">
        <div className="col-3 p-0 list-room-chat">
          <ListRoomChat
            getSelectRoom={setSelectedRoom}
            setMembers={setMembers}
            setShowRoomChat={setShowRoomChat}
          />
        </div>
        <div className="col-xs-12 col-9 p-0">
          <ContainerRoomChat
            selectedRoom={selectedRoom}
            members={members}
            showRoomChat={showRoomChat}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
