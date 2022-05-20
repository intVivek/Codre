import './RoomBox.scss';
import userIcon from '../../Assets/icons/user.svg';
import inviteIcon from '../../Assets/icons/lock.svg';
import openIcon from '../../Assets/icons/unlock.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {checkRoom} from '../../Services.js';

const RoomBox = (props) => {
  const {color, photo, roomName, invite, name, id} = props;
  const navigate = useNavigate();
  
  console.log(id);

  const clickHandler=()=>{      
    if(!id) return toast.error("Someting went wrong");
    checkRoom({room: id})
    .then(res=>{
      if(res?.status){
        console.log(res)
        navigate(`/chat/${id}`);
      }
      else{
        toast.error("Someting went wrong");
      }
    })
  }

  return (
    <div className='roomBox' style={{border: `2px solid ${color}`}} onClick={clickHandler}>
      <img className='dp' style={{border: `2px solid ${color}`}} src ={photo.slice(0,-6)}></img>
      <div className='top' style={{background: `${color}`}}></div>
      <div className='filter' ></div>
      <div className='roomName'>{id}</div>
      <div className='name'><img src={userIcon}/>{name}</div>
      <div className='invite'><img src={invite?inviteIcon:openIcon}/>{invite?'Invite Only':'Open'}</div>
    </div>
  )
}

export default RoomBox