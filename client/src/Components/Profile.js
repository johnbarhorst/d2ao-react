import React, { useContext } from 'react';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import { UserContext } from '../Contexts';
import { useSetPageTitle } from '../Hooks';
import styled from 'styled-components';
import EmblemCard from './EmblemCard';
import Guardian from './Guardian';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0 10px;
`;

const Profile = () => {
  const UserInfo = useContext(UserContext);
  const { isLoggedIn, userProfile, guardians } = UserInfo;
  const { url, path } = useRouteMatch();
  useSetPageTitle(userProfile.username);

  if (isLoggedIn) {
    return (
      <>
        <div>
          <h3>{userProfile.username}</h3>
        </div>
        <Wrapper>
          <div>
            {guardians.map(guardian =>
              <Link to={{
                pathname: `${url}/${guardian.characterId}`,
                state: { guardian }
              }}
                key={guardian.characterId}>
                <EmblemCard {...guardian} />
              </Link>
            )}
          </div>
          <div>
            <Switch>
              <Route path={`${path}/:guardianId`}
                render={value => <Guardian guardianInfo={value.location.state.guardian} />}
              />
            </Switch>
          </div>
        </Wrapper>
        <div>
        </div>
      </>
    )
  }
  return (
    <>
      <h3>You must log in first.</h3>
    </>
  )
}


export default Profile;