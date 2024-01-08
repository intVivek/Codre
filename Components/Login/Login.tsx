"use client";

import screenshot from "@/Assets/images/Screenshot.png";
import background from "@/Assets/images/PolygonLuminary.svg";
import MultiCursor from "@/Components/MultiCursor/MultiCursor";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../Services";
import LoadingPage from "../LoadingPage/LoadingPage";
import "./Login.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await isAuthenticated();
      setLoading(false);
      if (res.status === 1) router.push("/home");
    })();
  }, [router]);

  const baseUrl = process.env.API_URL;

  const attemptAuth = () => {
    window.location.replace(`${baseUrl}/auth/google`);
  };

  return (
    <>
      {loading ? (
        <LoadingPage loading={loading} />
      ) : (
        <div className="loginPage">
          <Image alt="background" className="background" src={background} />
          <div className="left">
            <MultiCursor />
            <div className="GoogleAuth" onClick={attemptAuth}>
              <FaGoogle />
              <p>Login with Google</p>
            </div>
          </div>
          <div className="right">
            <div className="image">
              <Image alt="screenshot" src={screenshot} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
