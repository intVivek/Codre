import './RoomBox.scss';
import userIcon from '../../Assets/icons/user.svg';
import inviteIcon from '../../Assets/icons/lock.svg';
import openIcon from '../../Assets/icons/unlock.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {checkRoom} from '../../Services.js';
import { useState} from 'react';

const RoomBox = (props) => {
  const {color, photo, roomName, invite, name, id, setLoading} = props;
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const clickHandler=()=>{    
    setLoading(true);
    if(!id) return toast.error("Someting went wrong");
    checkRoom({room: id})
    .then(res=>{
      if(res?.status){
        setLoading(false);
        navigate(`/room/${id}`);
      }
      else{
        toast.error("Someting went wrong");
      }
    })
  }

  return (
    <div className='roomBoxMain' style={{border: `2px solid ${color}`}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={clickHandler}>
      <img alt='dp' className={hover?'backDPExpand':'backDP'} src ={photo}></img>
      <div className={hover?'roomBoxIDHover':'roomBoxID'}>{id}</div>
      <div className={hover?'roomBoxHover':'roomBox'} >
        <img className='dp' alt='dp' style={{border: `2px solid ${color}`}} src ={photo}></img>
        <div className='top' style={{background: `${color}`}}></div>
        <div className='filter' ></div>
        <div className='roomName'>{roomName}</div>
        <div className='name'><img alt='userIcon' src={userIcon}/>{name}</div>
        <div className='invite'><img alt='inviteIcon' src={invite?inviteIcon:openIcon}/>{invite?'Invite Only':'Open'}</div>
      </div>
    </div>
  )
}

export default RoomBox