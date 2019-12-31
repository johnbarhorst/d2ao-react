import React, { useContext } from 'react';
import { UserContext } from '../App';


const Profile = () => {
  const UserInfo = useContext(UserContext);

  if (UserInfo.user) {
    return (
      <>
        <h3>Profile</h3>
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