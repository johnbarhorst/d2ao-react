import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-image: url(${props => 'https://www.bungie.net' + props.bgPath});
  color: rgb(221, 201, 24);
  width: 474px;
  height: 96px;
`;

const classTypeRef = ["Titan", "Hunter", "Warlock"];
const genderTypeRef = ["Male", "Female"];
const raceTypeRef = ["Human", "Awoken", "Exo"];


const EmblemCard = (props) => {

  return (
    <Card bgPath={props.emblemBackgroundPath}>
      <p>{props.light}</p>
      <p>{genderTypeRef[props.genderType]}</p>
      <p>{raceTypeRef[props.raceType]}</p>
      <p>{classTypeRef[props.classType]}</p>
    </Card>
  )
}
export default EmblemCard;