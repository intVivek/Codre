import './Home.scss';

const Home = ()=>{
  return(
    <div className='homePage'>
      <div className='window'>
        <input className='inputName' placeholder='USERNAME'/>
        <input className='inputRoom' placeholder='ROOM' />
        <button className='btn'>Enter</button>
      </div>
    </div>
  );
}

export default Home;