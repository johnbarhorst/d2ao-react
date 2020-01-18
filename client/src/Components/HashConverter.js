import React, { useState } from 'react';

const HashConverter = () => {
  const [value, setValue] = useState('');
  const [hash, setHash] = useState('');
  const convertHash = hash => {
    let x = parseInt(hash);
    if (x > 0xFFFFFFFF) {
      console.error('Too big, must have a wrong number');

    }
    if (x > 0x7FFFFFFF) {
      x = 0x100000000 - x;
      if (x < 2147483648) {
        return -x
      }
      else {
        return -2147483648
      }
    }
    return x;
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const convertedHash = convertHash(value);
    setHash(convertedHash);
    return
  }
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <p>{hash}</p>
        <input type="text" name="controlled" id="controlled" onChange={(e) => setValue(e.target.value)} value={value} />
        <button type="submit">Convert Hash</button>
      </form>

    </div>
  )
}

export default HashConverter;