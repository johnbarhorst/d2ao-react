import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Vault from './Vault';
import Loadouts from './Loadouts';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import HashConverter from './HashConverter';

const RouteManager = () => {
  return (
    <div>
      <Switch>
        <Route path='/vault'>
          <Vault />
        </Route>
        <Route path='/loadouts'>
          <Loadouts />
        </Route>
        <Route path='/profile'>
          <Profile />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/hash'>
          <HashConverter />
        </Route>
        <Route exact path='/'>
          <Home />
        </Route>
      </Switch>
    </div>
  )
}

export default RouteManager;

