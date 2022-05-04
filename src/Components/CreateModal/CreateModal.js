import './CreateModal.scss';
import CheckBox from '../CheckBox/CheckBox';

const CreateModal = () => {
  return (
    <div className='CreateModal'>
        <div className='windowGrad gradiantAnimation'>
            <div className='window'>
                <input className='roomName' placeholder='ROOM NAME'/>
                <textarea className='roomDesc' placeholder='Description'/>
                <CheckBox name={'Invite Only'}/>
                <div className='createModalBtns'>
                  <div className='cancelBtn'>Cancel</div>
                  <div className='createBtn'>Create</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateModal