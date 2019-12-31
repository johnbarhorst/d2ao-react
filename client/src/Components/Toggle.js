import React, { useState } from 'react';

const Toggle = ({ buttonText, children }) => {
  const [isToggled, setToggled] = useState(false);
  return (
    <>
      <button onClick={() => setToggled(!isToggled)}>{buttonText}</button>
      {isToggled && children}
    </>
  )
}

export default Toggle;
