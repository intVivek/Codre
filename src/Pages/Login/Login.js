import "./Login.scss";
import screenshot from "../../Assets/images/Screenshot.png";
import background from "../../Assets/images/PolygonLuminary.svg";
import MultiCursor from "../../Components/MultiCursor/MultiCursor";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../Services";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";
require("dotenv").config();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await isAuthenticated();
      setLoading(false)
      if (res.status===1) navigate("/home");
    })();
  }, [navigate]);

  const baseUrl = process.env.REACT_APP_API_URL;

  const attemptAuth = () => {
    window.location.replace(`${baseUrl}/auth/google`);
  };

  return (
    <>
      {loading ? (
        <LoadingPage loading={loading} />
      ) : (
        <div className="loginPage">
          <img alt="background" className="background" src={background} />
          <div className="left">
            <MultiCursor />
            <div className="GoogleAuth" onClick={attemptAuth}>
              <img
                alt="googleIcon"
                className="icon"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />
              <p>Login with Google</p>
            </div>
          </div>
          <div className="right">
            <div className="image">
              <img alt="screenshot" src={screenshot}></img>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
