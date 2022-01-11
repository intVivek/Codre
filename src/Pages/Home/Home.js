import './Home.css';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";

const Home = ()=>{
const [name,setName] = useState('guest');
const [room,setRoom] = useState('');
const navigate = useNavigate();

const clickHandler = () => {
  navigate(`/${room}?user=${name}`);
}

  return(
    <div className='homePage'>
      <div className='window'>
        <input className='inputName' onChange={e=>setName(e.target.value)} placeholder='USERNAME'/>
        <input className='inputRoom' onChange={e=>setRoom(e.target.value)} placeholder='ROOM' />
        <button className='btn' onClick={clickHandler}>Enter</button>
      </div>
    </div>
  );
}

export default Home;