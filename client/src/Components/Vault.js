import React, { useContext } from 'react';
import { UserContext } from '../Contexts';
import Item from './Item';

const Vault = () => {
  const { vault } = useContext(UserContext);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {vault.map((item, i) => (<Item itemData={item} key={i} />))}
    </div>
  )
}
export default Vault;