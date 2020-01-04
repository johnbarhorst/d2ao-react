import React from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import UserContext from './UserContext';
import Navigation from './Components/Navigation';
import RouteManager from './Components/RouteManager';
import './global.css';




const App = () => {
  return (
    <UserContext.Provider value={{
      user: false
    }}>
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
