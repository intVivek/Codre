import './Home.scss';
import NavBar from '../../Components/NavBar/NavBar.js';
import {fetchHome} from '../../Services.js';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import {checkRoom} from '../../Services.js';
import { toast } from 'react-toastify';


const Home = (props)=>{
  const [room,setRoom] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    fetchHome()
    .then(res => {
      if(res?.status){
        console.log(res)
        res && props.setUserData(res.user);
      }
      else{
        navigate('/');
      }
    })
    .catch(err => {
        console.log(err)
    })
  },[]);

  const joinHandler = ()=>{
    checkRoom({room})
    .then(res => {
      if(res.status===1){
        console.log(res)
        navigate(`/chat/${room}`);
      }
      else{
        toast.error("Room doesn't exist");
      }
    });
  }

  return(
    <div className='homePage'>
      <NavBar img={props.userData.photos?props.userData.photos[0].value:""}/>
      <div className='body'>
        <input className='roomJoinInput' onChange={(e)=>{setRoom(e.target.value)}}></input>
        <div class="joinBtn" onClick={joinHandler}>
          <span>Join Room</span>
        </div>
        <Button color="primary" onClick={()=>{navigate('/chat/createroom')}}>Create</Button>
      </div>

    </div>
  );
}

export default Home;