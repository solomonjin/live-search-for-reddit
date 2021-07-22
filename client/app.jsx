import React, { useState, useEffect } from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';
import AuthPage from './pages/auth-page';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

export default function App(props) {
  const [user, setUser] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(result => {
        setUser(result.user);
        setIsAuthorizing(false);
      });
  }, []);

  const handleSignIn = event => {
    event.preventDefault();
    fetch('/api/sign-in')
      .then(res => res.json())
      .then(result => {
        setUser(result.user);
      });
  };

  if (isAuthorizing) return null;

  const newContext = { user, handleSignIn };

  return (
    <AppContext.Provider value={newContext}>
      <>
        {/* Navbar component here */}
        <Router>
          <Switch>
            <Route exact path="/">
              {user ? <Home /> : <Redirect to="/sign-in" />}
            </Route>
            <Route path="/sign-in">
              <AuthPage />
            </Route>
          </Switch>
        </Router>
      </>
    </AppContext.Provider>
  );
}
