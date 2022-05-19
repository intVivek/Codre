import './RoomBox.scss';
import userIcon from '../../Assets/icons/user.svg';
import inviteIcon from '../../Assets/icons/lock.svg';
import openIcon from '../../Assets/icons/unlock.svg';

const RoomBox = (props) => {
  const {color, photo, roomName, invite, name, id} = props;
  
  console.log(props)
  return (
    <div className='roomBox' style={{border: `2px solid ${color}`}}>
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