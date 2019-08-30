import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/navbar.component';
import Landing from './components/layout/landing.component';
import Register from './components/auth/register.component';
import Login from './components/auth/login.component';
import Alert from './components/layout/alert.component';
import './app.root.css';

const App = props => (
  <BrowserRouter>
    <Navbar />
    <Route path="/" exact component={Landing} />
    <section className="container">
      <Alert />
      <Switch>
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
      </Switch>
    </section>
  </BrowserRouter>
);

export default App;
