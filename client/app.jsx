import React, { useState, useEffect, useRef } from 'react';
import { Home, AuthPage, Search } from './pages';
import AppContext from './lib/app-context';
import { Navbar, NetworkAlert } from './components';
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
  const [isSearching, setIsSearching] = useState(null);
  const [isError, setIsError] = useState(false);
  const notifSound = useRef(new Audio('/audio/notification.wav'));
  const history = useHistory();

  useEffect(() => {
    if (window.location.search) {
      setIsSearching(window.location.search);
      const params = new URLSearchParams(window.location.search);
      setKeywords(params.get('keywords'));
      setSubs(params.get('subscriptions'));
      const inbox = params.get('toggleInbox') === 'true';
      setToggleInbox(inbox);
    }
    fetch('/api/auth')
      .then(res => res.json())
      .then(result => {
        setUser(result.username);
        setIsAuthorizing(false);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const kw = params.get('keywords');
    const subs = params.get('subreddits');
    const inbox = params.get('toggleInbox');

    if (!kw || !subs || !inbox) return;

    const socket = io('/search', {
      query: {
        keywords: kw,
        subreddits: subs,
        toggleInbox: inbox
      }
    });

    socket.on('new_submission', submission => {
      setSearchResults(prevSearchResults => [submission, ...prevSearchResults]);
      notifSound.current.play();
    });

    return () => {
      socket.disconnect();
    };
  }, [isSearching]);

  useEffect(() => {
    if (searchResults.length === 0) return;

    const defaultTitle = 'Keyword Finder for Reddit';

    const titleInterval = setInterval(() => {
      document.title = document.title === 'Result Found!'
        ? defaultTitle
        : 'Result Found!';
    }, 1000);

    window.onmousemove = () => {
      document.title = defaultTitle;
      clearInterval(titleInterval);
    };

    return () => {
      document.title = defaultTitle;
      clearInterval(titleInterval);
    };
  }, [searchResults]);

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

  const demoSignIn = () => {
    fetch('/api/demo-sign-in')
      .then(res => res.json())
      .then(result => {
        setUser(result.username);
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
    const queryString = `/search?keywords=${kw}&subreddits=${subs}&toggleInbox=${inbox}`;
    history.push(queryString);
    closeSearchForm();
    setKeywords(kw);
    setSubs(subs);
    setToggleInbox(inbox);
    setIsSearching(queryString);
  };

  const hideError = () => {
    setIsError(false);
  };

  const showError = () => {
    setIsError(true);
  };

  if (isAuthorizing) return null;

  const newContext = {
    user,
    handleSignIn,
    demoSignIn,
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
    signOut,
    history,
    notifSound,
    showError
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
          <NetworkAlert
            open={isError}
            autoHideDuration={6000}
            onClose={hideError}
          />
        </Navbar>
      </AppContext.Provider>
    </ThemeProvider>
  );
}
