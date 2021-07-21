import React from 'react';
import Home from './pages/home';

export default function App(props) {
  const [user, setUser] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  return <Home />;
}
