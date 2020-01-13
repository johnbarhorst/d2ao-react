import React, { useState, useEffect } from 'react';


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
    <div>
      <p>{itemInstanceId}</p>
    </div>
  )
}
export default Item;