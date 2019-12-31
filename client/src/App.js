import React, { createContext } from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import Navigation from './Components/Navigation';
import RouteManager from './Components/RouteManager';
import './global.css';

export const UserContext = createContext();


const App = () => {
  return (
    <UserContext.Provider
      value={{
        user: true
      }}
    >
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
