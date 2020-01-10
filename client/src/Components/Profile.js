import React, { useContext } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { UserContext } from '../Contexts';
import { useSetPageTitle } from '../Hooks';
import EmblemCard from './EmblemCard';
import Guardian from './Guardian';


const Profile = () => {
  const UserInfo = useContext(UserContext);
  const { isLoggedIn, userProfile, guardians } = UserInfo;
  useSetPageTitle(userProfile.username);

  if (isLoggedIn) {
    return (
      <>
        <div>
          <h3>{userProfile.username}</h3>
        </div>
        {guardians.map(guardian =>
          <Link to={`/profile/${guardian.characterId}`} key={guardian.characterId}>
            <EmblemCard {...guardian} />
          </Link>
        )}
        <div>
          <Switch>
            <Route path={`/profile/:guardianId`}>
              <Guardian />
            </Route>
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