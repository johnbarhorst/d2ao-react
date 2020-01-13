import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ItemCard = styled.div`
  border: 1px solid black;
  border-radius: 5px;
`;



const Item = ({ membershipType, membershipId, itemData }) => {
  const [item, setItem] = useState({});
  const [itemPerks, setItemPerks] = useState([]);
  const { itemInstanceId } = itemData;

  const getItemDetails = async () => {
    const data = await fetch(`/api/getInstancedItemDetails/${membershipType}/${membershipId}/${itemInstanceId}`);
    const res = await data.json();
    console.log(res);
    setItem(res.instance.data);
    if (res.perks.data) {
      setItemPerks(res.perks.data.perks);
    }
  }

  useEffect(() => {
    getItemDetails();

  }, [itemInstanceId]);
  return (
    <ItemCard>
      <p>{itemInstanceId}</p>
    </ItemCard>
  )
}
export default Item;