import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadouts from './Loadouts';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';

const RouteManager = () => {
  return (
    <div>
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
  )
}

export default RouteManager;

