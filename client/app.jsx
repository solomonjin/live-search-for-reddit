import React, { useState, useEffect } from 'react';
import { Home, AuthPage, Search } from './pages';
import AppContext from './lib/app-context';
import Navbar from './components/navbar';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { io } from 'socket.io-client';

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
  const [searchResults, setSearchResults] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [subreddits, setSubs] = useState('');
  const [toggleInbox, setToggleInbox] = useState(false);
  const [searchFormOpen, setSearchFormOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(result => {
        setUser(result.username);
        setIsAuthorizing(false);
      });
  }, []);

  useEffect(() => {
    const socket = io('/search');
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

  const openSearchForm = () => {
    setSearchFormOpen(!searchFormOpen);
  };

  const closeSearchForm = () => {
    setSearchFormOpen(false);
  };

  const submitSearch = (event, kw, subs, inbox) => {
    event.preventDefault();
    setIsSearching(true);
    history.push('/search');
    closeSearchForm();
    setKeywords(kw);
    setSubs(subs);
    setToggleInbox(inbox);
  };

  if (isAuthorizing) return null;

  const newContext = {
    user,
    handleSignIn,
    keywords,
    subreddits,
    submitSearch,
    toggleInbox,
    searchResults,
    openSearchForm,
    closeSearchForm,
    searchFormOpen,
    isSearching
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={newContext}>
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
      </AppContext.Provider>
    </ThemeProvider>
  );
}
