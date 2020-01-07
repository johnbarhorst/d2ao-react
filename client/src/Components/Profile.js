import React, { useContext } from 'react';
import { UserContext } from '../Contexts';


const Profile = () => {
  const UserInfo = useContext(UserContext);
  const { isLoggedIn, userProfile, platforms } = UserInfo;

  if (isLoggedIn) {
    return (
      <>

        <h3>{userProfile.username}</h3>
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