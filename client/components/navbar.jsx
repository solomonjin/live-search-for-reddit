import React, { useState, useEffect } from 'react';
import { AppBar, Drawer, Hidden, Divider, Toolbar, Typography, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    background: 'linear-gradient(rgba(163, 216, 247, 0.5) 30%, rgba(197, 207, 243, 0.5) 90%)'
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: '20px'
  }
}));

export default function Navbar(props) {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    const getCurrentRoute = event => {
      const hrefArray = window.location.href.split('/');
      const route = hrefArray[hrefArray.length - 1].split('-');
      setCurrentPage(route.map(el => el[0].toUpperCase() + el.slice(1)).join(' '));
    };

    window.addEventListener('popstate', getCurrentRoute);

    return () => {
      window.removeEventListener('popstate', getCurrentRoute);
    };
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <IconButton
            onClick={toggleDrawer}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>{currentPage}</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
