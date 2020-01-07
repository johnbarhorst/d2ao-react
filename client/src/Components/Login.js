import React, { useContext } from 'react';
import { UserContext } from '../Contexts';

const tryLogin = () => {
  window.open('https://localhost:3001/auth/login', '_self');
}

const tryLogout = () => {
  window.open('https://localhost:3001/auth/logout', '_self');
}


const Login = () => {
  const userInfo = useContext(UserContext);
  return (
    <>
      <h3>Login</h3>
      <button onClick={() => tryLogin()} >Login</button>
      <button onClick={() => tryLogout()} >Logout</button>
      <button onClick={() => userInfo.updateLoginStatus()} >Test</button>
    </>
  )
}

export default Login;