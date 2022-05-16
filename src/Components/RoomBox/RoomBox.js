import './RoomBox.scss';

const RoomBox = (props) => {
  
  console.log(props)
  return (
    <div className='roomBox'>
      <img className='background' src ={props.data.user.photos[0].value.slice(0, -6)}/>
      <div className='filter' ></div>
    </div>
  )
}

export default RoomBox