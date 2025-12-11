import { useState, useEffect } from "react";
import { LoginChkContext } from "./LoginChkContext";
import api from "../api/axios";

export default function LoginChkProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태
  const [loginId, setterLoginId] = useState(""); // 로그인 된 유저 아이디
  const [loginUserNickname, setLoginUserNickname] = useState(""); // 로그인 된 유저 닉네임
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get("/user/loginCheck");
        if (res.data.isLogin) {
          setLoginUser(res.data.loginUser);
          setIsLogin(true);
          setterLoginId(res.data.loginId);
          setLoginUserNickname(res.data.loginUser.nickname);
        } else {
          setLoginUser("");
          setIsLogin(false);
          setterLoginId("");
          setLoginUserNickname("");
        }
      } catch (err) {
        console.log(err);
        setLoginUser("");
        setIsLogin(false);
        setterLoginId("");
        setLoginUserNickname("");
      }
    };
    checkLogin();
  }, []);

  return (
    <LoginChkContext.Provider
      value={{
        isLogin,
        setIsLogin,
        loginId,
        setterLoginId,
        loginUserNickname,
        setLoginUserNickname,
        loginUser,
        setLoginUser,
      }}
    >
      {children}
    </LoginChkContext.Provider>
  );
}
