import React, { useState, useEffect } from 'react';
import EquippedItems from './EquippedItems';


const Guardian = ({ guardianInfo }) => {
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const { membershipId, membershipType, characterId } = guardianInfo;
  const classTypeRef = ["Titan", "Hunter", "Warlock"];

  useEffect(() => {
    const getInventoryData = async () => {
      setLoading(true);
      const data = await fetch(`/api/GetFullEquipment/${membershipType}/${membershipId}/${characterId}`);
      const res = await data.json();
      console.log(res);
      setInventory(res.inventory);
      setEquipment(res.equipment);
      setLoading(false);
    }
    getInventoryData();
  }, [membershipId, membershipType, characterId]);

  return (
    <div>
      <h2>{classTypeRef[guardianInfo.classType]}</h2>
      {loading ? <h1>Loading</h1> :
        <EquippedItems equipment={equipment} />
      }
    </div>
  )
}

export default Guardian
