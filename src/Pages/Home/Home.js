import './Home.scss';
import NavBar from '../../Components/NavBar/NavBar.js';
import {fetchHome} from '../../Services.js';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import {checkRoom} from '../../Services.js';
import { toast } from 'react-toastify';


const Home = (props)=>{
  const [data,setData] = useState({});
  const [room,setRoom] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    fetchHome()
    .then(res => {
      if(res?.status){
        console.log(res)
        res && setData(res.user);
      }
      else{
        navigate('/login');
      }
    })
    .catch(err => {
        console.log(err)
    })
  },[]);

  useEffect(()=>{
    console.log();
  },[data]);

  const joinHandler = ()=>{
    checkRoom({room})
    .then(res => {
      if(res.status===1){
        console.log(res)
        props.setRoom(room);
        navigate('/chat');
      }
      else{
        toast.error("Room doesn't exist");
      }
    });
  }

  return(
    <div className='homePage'>
      <NavBar img={data.photos?data.photos[0].value:""}/>
      <div className='body'>
        <input className='roomJoinInput' onChange={(e)=>{setRoom(e.target.value)}}></input>
        <div class="joinBtn" onClick={joinHandler}>
          <span>Join Room</span>
        </div>
        <Button color="primary" onClick={()=>{navigate('/chat')}}>Create</Button>
      </div>

    </div>
  );
}

export default Home;