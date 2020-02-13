import React, { useState, useEffect } from 'react';


const DBLookup = () => {
  const [hash, setHash] = useState('');
  const [table, setTable] = useState('');
  const [tableList, setTableList] = useState([]);
  const [dbData, setDbData] = useState({});

  useEffect(() => {
    const getTables = async () => {
      const data = await fetch(`/api/tables`);
      const listOfDBTables = await data.json();
      setTableList(listOfDBTables);
      setTable(listOfDBTables[0]);
    }
    getTables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (hash.length < 1) {
      return
    }
    const data = await fetch(`/api/db/${table}/${hash}`)
    const json = await data.json();
    setDbData(json);
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <p>Table</p>
        <select type="select" name="controlledTable" id="controlledTable" onChange={(e) => setTable(e.target.value)} value={table}>
          {tableList.map(table => (<option value={table} key={table}>{table}</option>))}
        </select>
        <p>Hash</p>
        <input type="text" name="controlledHash" id="controlledHash" onChange={(e) => setHash(e.target.value)} value={hash} />
        <button type="submit">Get From Database</button>
      </form>
      <div><pre>{JSON.stringify(dbData, null, 2)}</pre></div>
    </div>
  )
}

export default DBLookup;