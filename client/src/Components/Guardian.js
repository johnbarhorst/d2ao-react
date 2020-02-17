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
  const { membershipId, membershipType, characterId, guardianClass, stats, equipment, inventory } = guardianInfo;

  return (
    <div>
      <h2>{guardianClass}</h2>
      <GuardianStatDisplay>
        {stats.map(stat => <GuardianStatCard stat={stat} key={stat.hash} />)}
      </GuardianStatDisplay>
      <EquippedItems equipment={equipment} />
    </div>
  )
}

export default Guardian
