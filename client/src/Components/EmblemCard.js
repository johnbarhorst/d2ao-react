import React, { useEffect } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  background-image: url(${props => 'https://www.bungie.net' + props.bgPath});
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

const classTypeRef = ["Titan", "Hunter", "Warlock"];
const genderTypeRef = ["Male", "Female"];
const raceTypeRef = ["Human", "Awoken", "Exo"];


const EmblemCard = (props) => {
  return (
    <Card bgPath={props.emblemBackgroundPath}>
      <div className='class-race' >
        <h3>{classTypeRef[props.classType]}</h3>
        <p>{`${raceTypeRef[props.raceType]} ${genderTypeRef[props.genderType]}`}</p>
      </div>
      <div>
        <h2>{props.light}</h2>
      </div>
    </Card>
  )
}
export default EmblemCard;