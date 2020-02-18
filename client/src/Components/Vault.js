import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Contexts';
import Item from './Item';

const Vault = () => {
  const { vault } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [consumables, setConsumables] = useState([]);
  const [modifications, setModifications] = useState([]);
  const [shaders, setShaders] = useState([]);
  const [general, setGeneral] = useState([]);
  const sortItems = inv => {
    const toCamelCase = (str) => {
      return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
    let sortedInventory = {};
    inv.forEach(item => {
      if (item.bucketDetails.displayProperties.name) {
        sortedInventory[toCamelCase(item.bucketDetails.displayProperties.name)] ?
          sortedInventory[toCamelCase(item.bucketDetails.displayProperties.name)].push(item) :
          sortedInventory[toCamelCase(item.bucketDetails.displayProperties.name)] = [item];
      }
    });
    return sortedInventory;
  }

  useEffect(() => {
    setLoading(true)
    const sorted = sortItems(vault);
    setConsumables(sorted.consumables);
    setModifications(sorted.modifications);
    setShaders(sorted.shaders);
    setGeneral(sorted.general);
    setLoading(false);
  }, [vault]);

  return (
    <div>
      {loading ? (<h1>Loading...</h1>) : (
        <div>
          <div>
            <h3>Consumables</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {consumables && consumables.map((item, i) => (<Item itemData={item} key={i} />))}
            </div>
          </div>
          <div>
            <h3>Modifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {modifications && modifications.map((item, i) => (<Item itemData={item} key={i} />))}
            </div>
          </div>
          <div>
            <h3>Shaders</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {shaders && shaders.map((item, i) => (<Item itemData={item} key={i} />))}
            </div>
          </div>
          <div>
            <h3>General</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {general && general.map((item, i) => (<Item itemData={item} key={i} />))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Vault;