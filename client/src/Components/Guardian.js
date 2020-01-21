import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Item from './Item';

const ItemDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
`;


const Guardian = ({ guardianInfo }) => {
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const { membershipId, membershipType, characterId } = guardianInfo;
  const classTypeRef = ["Titan", "Hunter", "Warlock"];

  useEffect(() => {
    const getInventoryData = async () => {
      const data = await fetch(`/api/GetFullEquipment/${membershipType}/${membershipId}/${characterId}`);
      const res = await data.json();
      console.log(res);
      setInventory(res.inventory);
      setEquipment(res.equipment);
    }
    getInventoryData();
  }, [membershipId, membershipType, characterId]);

  return (
    <div>
      <p>{classTypeRef[guardianInfo.classType]}</p>
      <ItemDisplay>
        {equipment.map(item =>
          <Item
            membershipType={membershipType}
            membershipId={membershipId}
            characterId={characterId}
            itemData={item}
            key={item.itemInstanceId}

          />
        )}
      </ItemDisplay>
    </div>
  )
}

export default Guardian
