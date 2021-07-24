import React, { useState, useEffect } from 'react';
import { Home, AuthPage, Search } from './pages';
import AppContext from './lib/app-context';
import Navbar from './components/navbar';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
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
  const [searchResults, setSearchResults] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [subreddits, setSubs] = useState('');
  const [toggleInbox, setToggleInbox] = useState(false);
  const [searchFormOpen, setSearchFormOpen] = useState(false);
  const history = useHistory();

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

  const openSearchForm = () => {
    setSearchFormOpen(!searchFormOpen);
  };

  const closeSearchForm = () => {
    setSearchFormOpen(false);
  };

  const changeKeywords = event => {
    setKeywords(event.target.value);
  };

  const changeSubs = event => {
    setSubs(event.target.value);
  };

  const changeInbox = event => {
    setToggleInbox(!toggleInbox);
  };

  const submitSearch = event => {
    event.preventDefault();
    const userInputs = {
      keywords,
      subreddits,
      sendToInbox: toggleInbox
    };
    const req = {
      method: 'post',
      body: JSON.stringify(userInputs),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/search', req)
      .then(res => res.json())
      .then(results => {
        history.push('/search');
        closeSearchForm();
        setSearchResults(results);
      })
      .catch(err => console.error(err));
  };

  if (isAuthorizing) return null;

  const newContext = {
    user,
    handleSignIn,
    changeKeywords,
    changeSubs,
    changeInbox,
    submitSearch,
    toggleInbox,
    searchResults,
    openSearchForm,
    closeSearchForm,
    searchFormOpen
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
