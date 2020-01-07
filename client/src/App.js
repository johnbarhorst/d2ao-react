import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import Navigation from './Components/Navigation';
import RouteManager from './Components/RouteManager';
import { UserContext } from './Contexts';
import './global.css';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [platforms, setPlatforms] = useState([]);
  const [guardians, setGuardians] = useState([]);

  const updateUserProfile = async () => {
    const data = await fetch(`/api/Profile/GetCurrentUser`);
    const res = await data.json();
    const { isLoggedIn, userProfile } = await res;
    setIsLoggedIn(isLoggedIn);
    if (res.isLoggedIn) {
      console.log('setting user')
      setUserProfile({ ...userProfile });
      console.log('setting platforms');
      setPlatforms([...userProfile.platforms]);
      getGuardians([...userProfile.platforms]);
    }
  }

  const getGuardians = async (platforms) => {
    if (platforms.length > 0) {
      console.log('fetching guardians');
      const data = platforms.map(async char => {
        const characters = await fetch(`api/GetCharacterList/${char.membershipType}/${char.membershipId}`);
        const json = await characters.json();
        return Array.from(Object.values(json.Response.characters.data));
      })
      const guardianList = await Promise.all(data);
      return setGuardians(...guardianList);
    }
    return setGuardians([]);
  }

  useEffect(() => {
    updateUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, userProfile, platforms }}>
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
