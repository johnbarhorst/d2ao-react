import React from 'react';

const ItemStatCard = ({ stats }) => {

  return (
    <ul>
      {stats.map(stat => (
        <li key={stat.statHash}>{stat.displayProperties.name}: {stat.value}</li>
      ))}
    </ul>
  )
}
export default ItemStatCard;