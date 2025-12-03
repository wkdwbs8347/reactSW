import { useState, useEffect } from "react";
import { LoginChkContext } from "./LoginChkContext";
import api from "../api/axios";

export default function LoginChkProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [loginId, setterLoginId] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get("/user/loginCheck");
        if (res.data.isLogin) {
          setIsLogin(true);
          setterLoginId(res.data.loginId);
        } else {
          setIsLogin(false);
          setterLoginId("");
        }
      } catch (err) {
        console.log(err);
        setIsLogin(false);
        setterLoginId("");
      }
    };
    checkLogin();
  }, []);

  return (
    <LoginChkContext.Provider value={{ isLogin, setIsLogin, loginId, setterLoginId }}>
      {children}
    </LoginChkContext.Provider>
  );
}