import React, { useState, useEffect } from 'react';
import Home from './pages/home';

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

  if (isAuthorizing) return null;
  return <Home />;
}
