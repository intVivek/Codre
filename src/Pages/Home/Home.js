import './Home.scss';
import NavBar from '../../Components/NavBar/NavBar.js';
import {fetchHome} from '../../Services.js';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {createRoom, fetchRoomData} from '../../Services.js';
import { toast } from 'react-toastify';
import {ReactComponent as Close} from '../../Assets/icons/close.svg';
import CreateModal from '../../Components/CreateModal/CreateModal';
import RoomBox from '../../Components/RoomBox/RoomBox';


const Home = ()=>{
  const [openModal, setOpenModal] = useState(false);
	const [userData, setUserData] = useState({});
  const [createdRooms, setCreatedRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    fetchHome()
    .then(res => {
      if(res?.status){
        console.log(res)
        res && setUserData(res.user);
        res && setCreatedRooms(res.createdRooms);
      }
      else{
        navigate('/');
      }
    })
    .catch(err => {
        console.log(err)
    })
  },[]);

  const createHandler = (data)=>{
    createRoom(data)
    .then(res=>{
      if(res?.status){
        console.log(res)
        navigate(`/chat/${res.room}`);
      }
      else{
        toast.error("Error Creating Room");
      }
    })
  }

  return(
    <div className='homePage'>
      <NavBar img={userData.photos?userData.photos[0].value:""}/>
      {openModal && <CreateModal createHandler={createHandler} userData={userData} setOpenModal={setOpenModal} />}
      <div className={openModal?'body blur':'body'}>
        <div className='createRoom'>
          <div className='createBtn' onClick={()=>setOpenModal(true)}><p>Create</p> <Close className={openModal?'addIcon addIconSpin':'addIcon'}/></div>
          <div className='joinInput gradiantAnimation'><input className='inputField' placeholder='Enter a code or link'/></div>
          <div className='joinBtn'>Join</div>
        </div>
        <div className='ownRoom'>
          <div  className='ownRoomTitle'>
            Your Rooms
          </div>
          <div className='ownRoomBody'>
            {
              createdRooms.map((room, i)=>{
                console.log(room)
                return <RoomBox room={room} index={i}/>
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;