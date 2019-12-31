import React, { useState } from 'react';


const ControlledInput = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <input type="text" name="controlled" id="controlled" onChange={(e) => setValue(e.target.value)} value={value} />
    </>
  )
}

export default ControlledInput;