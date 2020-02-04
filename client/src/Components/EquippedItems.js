import React from 'react';
import styled from 'styled-components';
import Item from './Item';

const ItemDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
`;

const EquippedItems = ({ equipment }) => {
  return (
    <div>
      <ItemDisplay>
        {equipment.map(item =>
          <Item
            itemData={item}
            key={item.itemInstanceId}
          />
        )}
      </ItemDisplay>
    </div>
  )
}

export default EquippedItems;