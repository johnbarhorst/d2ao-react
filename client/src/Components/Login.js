import React, { useEffect, useState } from 'react';

const tryLogin = () => {
  window.open('https://localhost:3001/auth/login', '_self');
}

const tryLogout = () => {
  window.open('https://localhost:3001/auth/logout', '_self');
}

const Login = () => {
  return (
    <>
      <h3>Login</h3>
      <button onClick={() => tryLogin()} >Login</button>
      <button onClick={() => tryLogout()} >Logout</button>
    </>
  )
}

export default Login;