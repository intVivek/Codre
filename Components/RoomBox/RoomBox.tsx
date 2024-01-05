// @ts-nocheck

import "./RoomBox.scss";
import userIcon from "../../Assets/icons/user.svg";
import inviteIcon from "../../Assets/icons/lock.svg";
import openIcon from "../../Assets/icons/unlock.svg";
import { toast } from "react-toastify";
import { checkRoom } from "../../Services.ts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@mui/material";

const RoomBox = (props) => {
  const { color, photo, roomName, invite, name, id, setLoading } = props;
  const [hover, setHover] = useState(false);

  const router = useRouter();

  const clickHandler = () => {
    setLoading(true);
    if (!id) return toast.error("Someting went wrong");
    checkRoom({ room: id }).then((res) => {
      if (res?.status) {
        setLoading(false);
        console.log(id);
        router.push(`/room/${id}`);
      } else {
        toast.error("Someting went wrong");
      }
    });
  };

  return (
    <div
      className="roomBoxMain"
      style={{ border: `2px solid ${color}` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={clickHandler}
    >
      <Avatar
        alt="dp"
        className={hover ? "backDPExpand" : "backDP"}
        src={photo}
      />
      <div className={hover ? "roomBoxIDHover" : "roomBoxID"}>{id}</div>
      <div className={hover ? "roomBoxHover" : "roomBox"}>
        <Avatar
          className="dp"
          alt="dp"
          style={{ border: `2px solid ${color}` }}
          src={photo}
        />
        <div className="top" style={{ background: `${color}` }}></div>
        <div className="filter"></div>
        <div className="roomName">{roomName}</div>
        <div className="name">
          <Image alt="userIcon" src={userIcon} />
          {name}
        </div>
        <div className="invite">
          <Image alt="inviteIcon" src={invite ? inviteIcon : openIcon} />
          {invite ? "Invite Only" : "Open"}
        </div>
      </div>
    </div>
  );
};

export default RoomBox;
