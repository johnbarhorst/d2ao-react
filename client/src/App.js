import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Navigation from './Components/Navigation';
import Loadouts from './Components/Loadouts';
import Login from './Components/Login';
import Home from './Components/Home';
import Profile from './Components/Profile';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Switch>
          <Route path='/loadouts'>
            <Loadouts />
          </Route>
          <Route path='/profile'>
            <Profile />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
