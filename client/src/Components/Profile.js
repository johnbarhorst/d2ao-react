import React, { useContext } from 'react';
import { UserContext } from '../Contexts';
import EmblemCard from './EmblemCard';


const Profile = () => {
  const UserInfo = useContext(UserContext);
  const { isLoggedIn, userProfile, guardians } = UserInfo;

  if (isLoggedIn) {
    return (
      <>
        <div>
          <h3>{userProfile.username}</h3>
        </div>
        {guardians.map(guardian =>
          <EmblemCard {...guardian} key={guardian.characterId} />
        )}
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