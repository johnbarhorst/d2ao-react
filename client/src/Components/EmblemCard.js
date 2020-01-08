import React from 'react';
import styled from 'styled-components';

const EmblemCard = (props) => {
  const Card = styled.div`
  background-image: url(${props => 'http://www.bungie.net' + props.bgPath});
  width: 300px;
  height: 100px;
`;

  return (
    <Card bgPath={props.emblemBackgroundPath}>
      <p>{props.light}</p>
    </Card>
  )
}
export default EmblemCard;