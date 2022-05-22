import './Login.scss';
import screenshot from '../../Assets/images/Screenshot.png';
import background from '../../Assets/images/PolygonLuminary.svg';
require("dotenv").config();

const Login = ()=>{

  const baseUrl = process.env.REACT_APP_API_URL;
  const attemptAuth = () => {
    window.location.replace(`${baseUrl}/auth/google`);
  };

  return(
    <div className='loginPage'>
      <img className='background' src={background}/>
      <div className='left'>
        <div className='GoogleAuth' onClick={attemptAuth}>
          <img alt='googleIcon' className='icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png'/>
          <p>Login with Google</p>
        </div>
      </div>
      <div className='right'>
        <div className='image'>
          <img alt='screenshot' src={screenshot}></img>
        </div>
      </div>
    </div>
  );
}

export default Login;