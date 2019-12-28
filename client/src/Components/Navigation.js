import React, { Component } from 'react';
import styled from 'styled-components';



const Li = styled.li`
  margin: 0 5px;
  &:first-child {
    margin-right: auto;
  }
`;

const Ul = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-content: center;
  list-style: none;
  padding: 0 10px;
`;

export default class Navigation extends Component {
  render() {
    return (
      <>
        <nav>
          <Ul>
            <Li>Destiny 2 Armor Optimizer</Li>
            <Li>Loadouts</Li>
            <Li>Profile</Li>
            <Li>Login</Li>
          </Ul>
        </nav>
      </>
    )
  }
}

