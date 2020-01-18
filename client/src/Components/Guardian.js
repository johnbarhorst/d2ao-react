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

  const test = async () => {
    const data = await fetch(`/database/GetFullEquipment/${membershipType}/${membershipId}/${characterId}`);
    const res = await data.json();
    console.log(res);
  }
  const testItem = async () => {
    // Lots of steps to do here:
    // check to see if the item is already in inventory. If not the request will fail.
    // If it isn't, we have to find it first. Is it on another character? Or in the Vault?
    // I think that to move them over, they have to go to the Vault first...
    // So move from character that has it to the vault,
    // Then from the vault to this character
    // Then equip.
    // Oh, also some of these requests have to happen 1 second apart, others 0.1s.
    const data = await fetch(`/api/Item/TransferItem`);
    const res = await data.json();
    console.log(res);
  }

  useEffect(() => {
    const getInventoryData = async () => {
      const data = await fetch(`/api/getCharacterInventory/${membershipType}/${membershipId}/${characterId}`);
      const res = await data.json();
      console.log(res);
      setInventory(res.inventory.data.items);
      setEquipment(res.equipment.data.items);
    }
    getInventoryData();
  }, [membershipId, membershipType, characterId]);

  return (
    <div>
      <button onClick={() => test()}>Test</button>
      <button onClick={() => testItem()}>Test Item</button>
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
