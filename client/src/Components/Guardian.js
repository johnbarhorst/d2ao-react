import React, { useState, useEffect } from 'react';
import Item from './Item';


const Guardian = ({ guardianInfo }) => {
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const { membershipId, membershipType, characterId } = guardianInfo;
  const classTypeRef = ["Titan", "Hunter", "Warlock"];



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
      <p>{classTypeRef[guardianInfo.classType]}</p>
      {equipment.map(item =>
        <Item
          membershipType={membershipType}
          membershipId={membershipId}
          characterId={characterId}
          itemData={item}
          key={item.itemInstanceId}
        />
      )}
    </div>
  )
}

export default Guardian