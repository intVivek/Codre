import './Home.scss';
import NavBar from '../../Components/NavBar/NavBar.js';
import {fetchHome} from '../../Services.js';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import {createRoom} from '../../Services.js';
import { toast } from 'react-toastify';
import MultiCursor from '../../Components/MultiCursor/MultiCursor.js';


const Home = ()=>{
  const [room,setRoom] = useState("");
	const [userData,setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    fetchHome()
    .then(res => {
      if(res?.status){
        console.log(res)
        res && setUserData(res.user);
      }
      else{
        navigate('/');
      }
    })
    .catch(err => {
        console.log(err)
    })
  },[]);

  const createHandler = ()=>{
    createRoom({'userId': userData.googleId})
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
      <div className='body'>
        <MultiCursor/>
        <input className='roomJoinInput' onChange={(e)=>{setRoom(e.target.value)}}></input>
        <div class="joinBtn" onClick={()=>navigate(`/chat/${room}`)}>
          <span>Join Room</span>
        </div>
        <Button color="primary" onClick={createHandler}>Create</Button>
      </div>

    </div>
  );
}

export default Home;