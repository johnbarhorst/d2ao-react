import React, { Component } from 'react';
import styled from 'styled-components';

const Li = styled.li`
`;

const Ul = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
`;

export default class Nav extends Component {
  render() {
    return (
      <>
        <nav>
          <h3>Destiny 2 Armor Optimizer</h3>
          <Ul>
            <li>Loadouts</li>
            <li>Profile</li>
            <li>Login</li>
          </Ul>
        </nav>
      </>
    )
  }
}

