import React from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import Navigation from './Components/Navigation';
import RouteManager from './Components/RouteManager';
import './global.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <RouteManager />
      </div>
    </Router>
  );
}

export default App;
