import React from 'react';
import styled from 'styled-components';
import ItemStatCard from './ItemStatCard';
import SocketsCard from './SocketsCard';

const ItemCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid black;
  border-radius: 5px;
  `;

const Img = styled.img`
margin: 5px;
border: 1px solid #333;
`

const Item = ({ itemData }) => {
  const { displayProperties, instanceDetails, stats, sockets } = itemData;
  const damageTypeEnum = ["None", "Kinetic", "Arc", "Solar", "Void", "Raid"];
  const energyTypeEnum = ["Any", "Arc", "Solar", "Void"];
  const testItem = async () => {
    // Lots of steps to do here:
    // check to see if the item is already in inventory. If not the request will fail.
    // If it isn't, we have to find it first. Is it on another character? Or in the Vault?
    // I think that to move them over, they have to go to the Vault first...
    // So move from character that has it to the vault,
    // Then from the vault to this character
    // Then equip.
    // Oh, also some of these requests have different throttles, 1 second apart, others 0.1s.
    // Transfer Item endpoint:  throttle is 0.1 seconds
    // Equip item endpoint: throttle is 0.1 seconds

    // Insert Socket Plug: throttle is 1 second
    // Looks like fun!
    // https://bungie-net.github.io/multi/schema_Destiny-Requests-Actions-DestinyInsertPlugsRequestEntry.html#schema_Destiny-Requests-Actions-DestinyInsertPlugsRequestEntry

    //Not sure that this will actually be a fetch. though I think there is a success/failure response.
    // const data = await fetch(`/api/Item/TransferItem`);

  }

  const toCamelCase = (str) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }
  // const sortSockets = socket => {
  //   let sortedSockets = {};
  //   socket.forEach(socket => {
  //     if (socket.plugDefinitions.itemTypeDisplayName) {
  //       sortedSockets[toCamelCase(socket.plugDefinitions.itemTypeDisplayName)] ?
  //         sortedSockets[toCamelCase(socket.plugDefinitions.itemTypeDisplayName)].push(socket) :
  //         sortedSockets[toCamelCase(socket.plugDefinitions.itemTypeDisplayName)] = [socket];
  //     }
  //   })
  //   return sortedSockets
  // }
  // const sortedSockets = sortSockets(sockets);
  // console.log(sortedSockets);

  return (
    <ItemCard>
      <div>
        {displayProperties && displayProperties.hasIcon ? (
          <>
            <Img src={`https://www.bungie.net${displayProperties.icon}`}
              alt={`${displayProperties.name}`} />
            <p>{displayProperties.name}</p>
          </>
        ) : null}
        {/* <button onClick={() => testItem()}>Test Item</button> */}
      </div>
      <div>
        {instanceDetails && instanceDetails.damageType > 0 ? (
          <p>{damageTypeEnum[instanceDetails.damageType]}</p>
        ) : null}
        {instanceDetails && instanceDetails.energy ? (
          <>
            <p>{energyTypeEnum[instanceDetails.energy.energyType]}</p>
            <p>Max Energy: {instanceDetails.energy.energyCapacity}</p>
          </>
        ) : null}
        {stats && <ItemStatCard stats={stats} />}
        {sockets && <SocketsCard sockets={sockets} />}
      </div>
    </ItemCard>
  )
}
export default Item;