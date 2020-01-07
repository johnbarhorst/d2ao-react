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

  const updateUserProfile = async () => {
    const data = await fetch(`/api/Profile/GetCurrentUser`);
    const res = await data.json();
    const { isLoggedIn, userProfile } = await res;
    setIsLoggedIn(isLoggedIn);
    if (res.isLoggedIn) {
      setUserProfile({ userProfile });
      setPlatforms([...userProfile.platforms]);
    }
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
