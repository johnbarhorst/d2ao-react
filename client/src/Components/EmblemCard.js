import React from 'react';
import styled from 'styled-components';


const Card = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ffffff url(${props => 'https://www.bungie.net' + props.bgPath}) no-repeat;
  color: #f5f5f5;
  width: 474px;
  height: 96px;
  margin-bottom: 5px;

  .class-race {
    margin-left: 96px;
    h3 {
      font-weight: normal;
      font-size: 1.5em;
      margin-top: 1rem;
      margin-bottom: .2rem;
    }
    p {
      margin: 0;
    }

  }

  h2 {
    font-weight: normal;
    color: rgb(221, 201, 24);
    margin-right: 5px;
  }
`;

const EmblemCard = ({ race, gender, light, guardianClass, emblemBackgroundPath }) => {
  return (
    <Card bgPath={emblemBackgroundPath}>
      <div className='class-race' >
        <h3>{guardianClass}</h3>
        <p>{`${race} ${gender}`}</p>
      </div>
      <div>
        <h2>{light}</h2>
      </div>
    </Card>
  )
}
export default EmblemCard;