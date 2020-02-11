import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GuardianStatCard from './GuardianStatCard';
import EquippedItems from './EquippedItems';

const GuardianStatDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;  
`;


const Guardian = ({ guardianInfo }) => {
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const { membershipId, membershipType, characterId, guardianClass, stats } = guardianInfo;

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
      <h2>{guardianClass}</h2>
      <GuardianStatDisplay>
        {stats.map(stat => <GuardianStatCard stat={stat} key={stat.hash} />)}
      </GuardianStatDisplay>
      {loading ? <h1>Loading</h1> :
        <EquippedItems equipment={equipment} />
      }
    </div>
  )
}

export default Guardian
