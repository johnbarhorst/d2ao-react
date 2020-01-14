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

  useEffect(() => {
    const getItemDetailsFromDB = async () => {
      const data = await fetch(`/database/GetItemDetails/${itemHash}`);
      const itemDetails = await data.json();
      setStaticItemDetails(itemDetails);
    }
    getItemDetailsFromDB()

  }, [itemHash])

  useEffect(() => {
    const getItemInstanceDetails = async () => {
      const data = await fetch(`/api/getInstancedItemDetails/${membershipType}/${membershipId}/${itemInstanceId}`);
      const res = await data.json();
      console.log(res);
      setItemInstance(res.instance.data);
      if (res.perks.data) {
        setItemPerks(res.perks.data.perks);
      }
    }
    getItemInstanceDetails();

  }, [itemInstanceId, membershipId, membershipType]);
  return (
    <ItemCard>
      {staticItemDetails ? (
        <>
          <img src={`https://www.bungie.net${staticItemDetails.displayProperties.icon}`}
            alt={`${staticItemDetails.displayProperties.name}`} />
          <p>{staticItemDetails.displayProperties.name}</p>
        </>
      ) : null}
    </ItemCard>
  )
}
export default Item;