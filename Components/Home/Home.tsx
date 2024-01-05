// @ts-nocheck
"use client";

import "./Home.scss";
import NavBar from "../NavBar";
import { useState, useEffect } from "react";
import { createRoom, checkRoom, fetchHome } from "../../Services.ts";
import { toast } from "react-toastify";
import CloseIcon from "../../Assets/icons/close.svg";
import CreateModal from "../CreateModal/CreateModal";
import RoomBox from "../RoomBox";
import LoadingPage from "@/Components/LoadingPage";
import MosaicLoading from "../MosaicLoading/MosaicLoading.js";
import LoadingIcon from "../../Assets/icons/loading.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomOpenLoading, setRoomOpenLoading] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [joinRoomLoading, setJoinRoomLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchHome()
      .then((res) => {
        if (res?.status === 1) {
          res && setUserData(res?.home[0]);
          res && setPopular(res?.home[1]);
          setLoading(false);
        } else {
          router.push("/");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong");
      });
    // eslint-disable-next-line
  }, []);

  const createHandler = (data) => {
    createRoom(data).then((res) => {
      if (res?.status) {
        router.push(`/room/${res.room}`);
      } else {
        toast.error("Error Creating Room");
      }
    });
  };

  const joinRoomHandler = () => {
    let room = joinInput;
    setJoinRoomLoading(true);
    room = room.split("/").pop();
    room = room.replaceAll(" ", "");
    if (!room) return toast.error("Please Enter Room");
    checkRoom({ room }).then((res) => {
      if (res?.status === 1) {
        router.push(`/room/${room}`);
      } else {
        toast.error(res.message);
      }
      setJoinRoomLoading(false);
    });
  };

  return (
    <div className="homePage">
      <LoadingPage loading={loading} />
      {roomOpenLoading && <MosaicLoading />}
      <NavBar img={userData?.photos ? userData.photos[0].value : ""} />
      {openModal && (
        <CreateModal
          createHandler={createHandler}
          userData={userData}
          setOpenModal={setOpenModal}
        />
      )}
      <div className={openModal ? "body blur" : "body"}>
        <div className="createRoom">
          <div className="createBtn" onClick={() => setOpenModal(true)}>
            <p>Create</p>
            <RxCross1
              src={CloseIcon}
              className={openModal ? "addIcon addIconSpin" : "addIcon"}
              alt={"CloseIcon"}
            />
          </div>
          <div className="joinInput gradiantAnimation">
            <input
              className="inputField"
              placeholder="Enter a code or link"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
            />
          </div>
          <div className="joinBtn" onClick={joinRoomHandler}>
            {joinRoomLoading ? (
              <Image src={LoadingIcon} alt={"LoadingIcon"} />
            ) : (
              "Join"
            )}
          </div>
        </div>
        <div className="ownRoom">
          {popular?.length > 0 && (
            <>
              <div className="ownRoomTitle">
                Popular Rooms
                <div className="border"></div>
              </div>
              <div className="ownRoomBody">
                {popular.map((room, i) => {
                  return (
                    <RoomBox
                      color={room.user.color}
                      photo={room.user.photos[0].value}
                      roomName={room.roomName}
                      invite={room.invite}
                      id={room._id}
                      name={room.user.name.givenName}
                      key={i}
                      setLoading={setRoomOpenLoading}
                    />
                  );
                })}
              </div>
            </>
          )}
          {userData?.created?.length > 0 && (
            <>
              <div className="ownRoomTitle">
                Your Rooms
                <div className="border"></div>
              </div>
              <div className="ownRoomBody">
                {userData.created.map((room, i) => {
                  return (
                    <RoomBox
                      color={userData.color}
                      photo={userData.photos[0].value}
                      roomName={room.roomName}
                      invite={room.invite}
                      id={room._id}
                      name={userData.name.givenName}
                      key={i}
                      setLoading={setRoomOpenLoading}
                    />
                  );
                })}
              </div>
            </>
          )}
          {userData?.recentlyJoined?.length > 0 && (
            <>
              <div className="ownRoomTitle">
                Recently Joined
                <div className="border"></div>
              </div>
              <div className="ownRoomBody">
                {userData.recentlyJoined.map((room, i) => {
                  return (
                    <RoomBox
                      color={room.user.color}
                      photo={room.user.photos[0].value}
                      roomName={room.roomName}
                      invite={room.invite}
                      id={room._id}
                      name={room.user.name.givenName}
                      key={i}
                      setLoading={setRoomOpenLoading}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
