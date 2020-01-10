import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import Navigation from './Components/Navigation';
import RouteManager from './Components/RouteManager';
import { UserContext } from './Contexts';
import 'normalize.css';
import './global.css';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [platforms, setPlatforms] = useState([]);
  const [guardians, setGuardians] = useState([]);

  const checkLoginStatus = async () => {
    const data = await fetch(`/auth/checkAuth`);
    const res = await data.json();
    setIsLoggedIn(res);
  }

  const getGuardians = async (platforms) => {
    if (platforms.length > 0) {
      const data = platforms.map(async char => {
        const characters = await fetch(`api/GetCharacterList/${char.membershipType}/${char.membershipId}`);
        const json = await characters.json();
        return Array.from(Object.values(json.characters.data));
      })
      const guardianList = await Promise.all(data);
      return setGuardians(...guardianList);
    }
    return setGuardians([]);
  }

  const updateUserProfile = async () => {
    const data = await fetch(`/api/Profile/GetCurrentUser`);
    const res = await data.json();
    const userProfile = await res.userProfile;
    if (userProfile) {
      setUserProfile({ ...userProfile });
      setPlatforms([...userProfile.platforms]);
      getGuardians([...userProfile.platforms]);
    }
  }

  useEffect(() => {
    checkLoginStatus();
  });

  useEffect(() => {
    updateUserProfile();
  }, [isLoggedIn]);


  return (
    <UserContext.Provider value={{ isLoggedIn, userProfile, platforms, guardians }}>
      <Router>
        <div className="App">
          <Navigation />
          <RouteManager />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
