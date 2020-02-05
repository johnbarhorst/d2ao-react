import React from 'react';

const ItemStatCard = ({ investmentStats }) => {

  return (
    <div>
      {investmentStats.map(stat => (
        <React.Fragment key={stat.statTypeHash} >
          {stat.value > 0 && (
            <p>{stat.statDefinition.displayProperties.name}: {stat.value}</p>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
export default ItemStatCard;