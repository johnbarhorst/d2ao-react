import React, { useContext } from 'react';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import { UserContext } from '../Contexts';
import { useSetPageTitle } from '../Hooks';
import EmblemCard from './EmblemCard';
import Guardian from './Guardian';


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
        {guardians.map(guardian =>
          <Link to={{
            pathname: `${url}/${guardian.characterId}`,
            state: { guardian }
          }}
            key={guardian.characterId}>
            <EmblemCard {...guardian} />
          </Link>
        )}
        <div>
          <Switch>
            <Route path={`${path}/:guardianId`}
              render={value => <Guardian guardianInfo={value.location.state.guardian} />}
            />
          </Switch>
        </div>
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