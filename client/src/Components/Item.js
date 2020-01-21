import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ItemCard = styled.div`
  border: 1px solid black;
  border-radius: 5px;
`;



const Item = ({ membershipType, membershipId, itemData }) => {
  const [itemInstance, setItemInstance] = useState({});
  const [itemPerks, setItemPerks] = useState([]);
  const [staticItemDetails, setStaticItemDetails] = useState(null);
  const { itemInstanceId, itemHash } = itemData;
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
    const data = await fetch(`/api/Item/TransferItem`);

  }

  useEffect(() => {
    const getItemDetailsFromDB = async () => {
      const data = await fetch(`/database/GetItemDetails/${itemHash}`);
      const itemDetails = await data.json();
      setStaticItemDetails(itemDetails);
    }
    getItemDetailsFromDB()

  }, [itemHash])

  return (
    <ItemCard>
      {staticItemDetails ? (
        <>
          <img src={`https://www.bungie.net${staticItemDetails.displayProperties.icon}`}
            alt={`${staticItemDetails.displayProperties.name}`} />
          <p>{staticItemDetails.displayProperties.name}</p>
        </>
      ) : null}
      <button onClick={() => testItem()}>Test Item</button>
    </ItemCard>
  )
}
export default Item;