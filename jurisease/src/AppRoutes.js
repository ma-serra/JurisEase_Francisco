import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import AuthPage from './pages/AuthPage';

function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
}

export default AppRoutes;
