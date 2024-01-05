import './CreateModal.scss';
import CheckBox from '../CheckBox/CheckBox';
import {useState} from 'react';
import { toast } from 'react-toastify';

const CreateModal = (props) => {
  const [roomName,setRoomName] = useState("");
  const [desc,setDesc] = useState("");
  const [invite,setInvite] = useState(false);

  const createRoomHandler=()=>{
    if(!roomName) return toast.error("Please Enter Room Name");
    props.createHandler({roomName, desc, invite, 'user': props.userData});
  }

  return (
    <div className='CreateModal'>
        <div className='windowGrad gradiantAnimation'>
            <div className='window'>
            <div className='roomName gradiantAnimation'><input className='text' value={roomName} placeholder='ROOM NAME' onChange={(e)=>setRoomName(e.target.value)}/></div>
            <div className='roomDesc gradiantAnimation'><textarea className='text' value={desc} placeholder='Description' onChange={(e)=>setDesc(e.target.value)}/></div>
                <CheckBox name={'Invite Only'} invite={invite} setInvite={setInvite}/>
                <div className='createModalBtns'>
                  <div className='cancelBtn' onClick={()=>props.setOpenModal(false)}>Cancel</div>
                  <div className='createBtn' onClick={createRoomHandler}>Create</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateModal