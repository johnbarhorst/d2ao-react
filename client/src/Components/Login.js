import React, { useEffect, useState } from 'react';

const tryLogin = async () => {
  window.open('https://localhost:3001/auth/login');
}

const Login = () => {
  return (
    <>
      <h3>Login</h3>
      <button onClick={() => tryLogin()} >Login</button>
    </>
  )
}

export default Login;