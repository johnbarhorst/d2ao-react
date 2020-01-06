import React, { useState } from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { UserContext, User } from './UserContext';
import Navigation from './Components/Navigation';
import RouteManager from './Components/RouteManager';
import './global.css';




const App = () => {
  const [user, setUser] = useState(User);
  console.log(user);
  return (
    <UserContext.Provider value={user}>
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
