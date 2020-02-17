import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  display: flex;
`;

const GuardianStatCard = ({ stat }) => {
  const { description, hasIcon, name } = stat.displayProperties;
  return (
    <Div>
      {hasIcon && (<img src={`https://www.bungie.net${stat.displayProperties.icon}`} style={{ backgroundColor: '#333' }} alt={{ name }} />)}
      <p>{name}: {stat.value}</p>
    </Div>
  )
}

export default GuardianStatCard;