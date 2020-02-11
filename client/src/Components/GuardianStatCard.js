import React from 'react';

const GuardianStatCard = ({ stat }) => {
  const { description, hasIcon, name } = stat.displayProperties;
  return (
    <>
      {hasIcon && (<img src={`https://www.bungie.net${stat.displayProperties.icon}`} style={{ backgroundColor: '#333' }} />)}
      <p>{name}</p>
    </>
  )
}

export default GuardianStatCard;