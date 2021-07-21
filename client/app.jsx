import React, { useState } from 'react';
import Home from './pages/home';

export default function App(props) {
  const [user, setUser] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  if (isAuthorizing) return;
  return <Home />;
}
