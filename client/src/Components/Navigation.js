import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
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
            <Li><Link to='/'>Destiny 2 Armor Optimizer</Link></Li>
            <Li><Link to='/loadouts'>Loadouts</Link></Li>
            <Li><Link to='/profile'>Profile</Link></Li>
            <Li><Link to='/login'>Login</Link></Li>
          </Ul>
        </nav>
      </>
    )
  }
}

