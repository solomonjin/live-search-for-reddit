import React, { useState } from 'react';
import { AppBar, Drawer, Hidden, Toolbar, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import MyDrawer from './drawer';
import SearchForm from './search-form';
import { useLocation } from 'react-router-dom';

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
    background: 'linear-gradient(rgba(197, 207, 243, 0.5) 20%, rgba(163, 216, 247, 0.5) 90%)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)'
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    background: '#f9f9f9'
  },
  content: {
    flexGrow: 1,
    padding: '20px'
  },
  typography: {
    color: '#393e41'
  },
  justifyBetween: {
    justifyContent: 'space-between'
  }
}));

export default function Navbar(props) {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const parsePath = path => {
    const pathName = path.split('/')[1];
    return pathName[0].toUpperCase() + pathName.slice(1);
  };

  const currentPage = location.pathname === '/'
    ? 'Home'
    : parsePath(location.pathname);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar className={classes.justifyBetween}>
          <IconButton
            onClick={toggleDrawer}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.typography} variant="h6" noWrap>{currentPage}</Typography>
          {/* Search Icon + Form drawer below */}
          <SearchForm />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            classes={{
              paper: classes.drawerPaper
            }}
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
          >
            <MyDrawer />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
          >
            <MyDrawer />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        {props.children}
      </main>
    </div>
  );
}
