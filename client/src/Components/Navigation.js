import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from '../Contexts';



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

const Navigation = () => {
  const UserInfo = useContext(UserContext);
  return (
    <>
      <nav>
        <Ul>
          {/* TODO: NavLink */}
          <Li><Link to='/'>Destiny 2 Armor Optimizer</Link></Li>
          <Li><Link to='/loadouts'>Loadouts</Link></Li>
          {UserInfo.isLoggedIn ? (
            <Li><Link to='/profile'>Profile</Link></Li>
          ) : (
              <Li><Link to='/login'>Login</Link></Li>
            )}
        </Ul>
      </nav>
    </>
  )
}

export default Navigation;

