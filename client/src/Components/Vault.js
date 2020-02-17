import React from 'react';
import Item from './Item';

const Vault = ({ vault }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {vault.map((item, i) => (<Item itemData={item} key={i} />))}
    </div>
  )
}
export default Vault;