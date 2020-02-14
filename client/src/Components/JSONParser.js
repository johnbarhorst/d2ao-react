import React, { useState, useEffect } from 'react';


const JSONKeyDisplay = ({ name, value }) => {
  const [jsonKeyArray, setJsonKeyArray] = useState([]);
  useEffect(() => {
    const arr = Array.from(Object.keys(value));
    setJsonKeyArray(arr);
  }, [value])
  return (
    <div>
      <p>
        {name}:
      </p>
      {jsonKeyArray.map(val => (<p>{val}</p>))}
    </div>
  )
}

const JSONParser = ({ json }) => {
  const [jsonArray, setJsonArray] = useState([]);

  useEffect(() => {
    const arr = Array.from(Object.keys(json));
    setJsonArray(arr);
    console.log(json['displayProperties']);
  }, [json]);
  return (
    <div>
      {jsonArray.map((name, i) => (<JSONKeyDisplay key={i} name={name} value={json[name]} />))}
    </div>
  )
}

export default JSONParser;