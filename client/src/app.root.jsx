import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/navbar.component';
import Landing from './components/layout/landing.component';
import Register from './components/auth/register.component';
import Login from './components/auth/login.component';
import './app.root.css';

const App = props => (
  <BrowserRouter>
    <Navbar />
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
    </Switch>
  </BrowserRouter>
);

export default App;
