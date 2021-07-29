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
  const [searchResults, setSearchResults] = useState([]);
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
    if (keywords === '' || subreddits === '') return;

    const socket = io('/search', {
      query: {
        keywords,
        subreddits,
        toggleInbox
      }
    });

    socket.on('new_submission', submission => {
      setSearchResults(prevSearchResults => [submission, ...prevSearchResults]);
    });

    return () => {
      socket.disconnect();
    };
  }, [keywords, subreddits]);

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

  const signOut = () => {
    fetch('/api/sign-out')
      .then(res => res.json())
      .then(user => {
        setUser(null);
      })
      .catch(err => console.error(err));
  };

  const submitSearch = (event, kw, subs, inbox) => {
    event.preventDefault();
    history.push('/search');
    closeSearchForm();
    setKeywords(kw);
    setSubs(subs);
    setToggleInbox(inbox);
    setIsSearching(true);
  };

  if (isAuthorizing) return null;

  const newContext = {
    user,
    handleSignIn,
    keywords,
    setKeywords,
    subreddits,
    setSubs,
    submitSearch,
    toggleInbox,
    searchResults,
    setSearchResults,
    openSearchForm,
    closeSearchForm,
    searchFormOpen,
    isSearching,
    setIsSearching,
    signOut
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
