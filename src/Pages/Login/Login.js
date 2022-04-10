import './Login.scss';
require("dotenv").config();

const Login = ()=>{

  const attemptAuth = async () => {
    window.location.replace('http://localhost:5000/auth/google');
  };

  return(
    <div className='loginPage'>
      <div className='window'>
        <div className='GoogleAuth' onClick={attemptAuth}>Google Login</div>
      </div>
    </div>
  );
}

export default Login;