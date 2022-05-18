import './RoomBox.scss';
import user from '../../Assets/icons/user.svg';
import invite from '../../Assets/icons/lock.svg';
import open from '../../Assets/icons/unlock.svg';

const RoomBox = (props) => {
  
  console.log(props)
  return (
    <div className='roomBox' style={{border: `2px solid ${props.data.user.color}`}}>
      <img className='dp' style={{border: `2px solid ${props.data.user.color}`}} src ={props.data.user.photos[0].value.slice(0,-6)}></img>
      <div className='top' style={{background: `${props.data.user.color}`}}></div>
      <div className='filter' ></div>
      <div className='roomName'>{props.data.roomName}</div>
      <div className='name'><img src={user}/>{props.data.user.name.givenName}</div>
      <div className='invite'><img src={props.data.invite?invite:open}/>{props.data.invite?'Invite Only':'Open'}</div>
    </div>
  )
}

export default RoomBox