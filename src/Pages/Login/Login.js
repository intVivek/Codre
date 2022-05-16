import './Login.scss';
import screenshot from '../../Assets/images/Screenshot.png';
import background from '../../Assets/images/PolygonLuminary.svg';
require("dotenv").config();

const Login = ()=>{

  const attemptAuth = () => {
    window.location.replace('http://localhost:5000/auth/google');
  };

  return(
    <div className='loginPage'>
      <img className='background' src={background}/>
      <div className='left'>
        <div className='GoogleAuth' onClick={attemptAuth}>
          <img className='icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png' alt='Google Logo'/>
          <p>Login with Google</p>
        </div>
      </div>
      <div className='right'>
        <div className='image'>
          <img src={screenshot}></img>
        </div>
      </div>
    </div>
  );
}

export default Login;