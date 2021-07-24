import React, { useState, useEffect } from 'react';
import { Home, AuthPage, Search } from './pages';
import AppContext from './lib/app-context';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a3d8f7'
    },
    secondary: {
      main: '#ff4300'
    }
  }
});

export default function App(props) {
  const [user, setUser] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(result => {
        setUser(result.username);
        setIsAuthorizing(false);
      });
  }, []);

  const handleSignIn = event => {
    event.preventDefault();
    fetch('/api/sign-in')
      .then(res => res.json())
      .then(result => {
        const url = new URL(result);
        window.location.replace(url);
      })
      .catch(err => console.error(err));
  };

  if (isAuthorizing) return null;

  const newContext = { user, handleSignIn };

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={newContext}>
        <Router>
          <Navbar>
            <Switch>
              <Route exact path="/">
                {user ? <Home /> : <Redirect to="/sign-in" />}
              </Route>
              <Route path="/sign-in">
                {!user ? <AuthPage /> : <Redirect to="/" />}
              </Route>
              <Route path="/search">
                {user ? <Search /> : <Redirect to="/sign-in" />}
              </Route>
            </Switch>
          </Navbar>
        </Router>
      </AppContext.Provider>
    </ThemeProvider>
  );
}
