import React, { useContext } from 'react';
import {
  Paper, Box, Grid, Typography, List, ListItem,
  ListItemIcon, ListItemText, Divider
} from '@material-ui/core';
import RedditLogo from './reddit-logo';
import HomeIcon from '@material-ui/icons/Home';
import InboxIcon from '@material-ui/icons/Inbox';
import SearchIcon from '@material-ui/icons/Search';
import LoginIcon from '@material-ui/icons/Login';
import LogoutIcon from '@material-ui/icons/Logout';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../lib/app-context';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '90%',
    borderRadius: 20
  }
}));

export default function MyDrawer(props) {
  const classes = useStyles();
  const { user } = useContext(AppContext);

  const handleClick = event => {
    if (!props.toggleDrawer) return;
    props.toggleDrawer();
  };

  return (
  <>
    <Box p={1} pt={2}>
      <Grid container justifyContent="center">
        <Paper className={classes.paper} elevation={1}>
          <Box p={1}>
            <Grid container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={1} align="center">
                <RedditLogo />
              </Grid>
              <Grid item xs align="center">
                <Typography align='center' noWrap variant='caption'>
                  {user ? `u/${user}` : 'Not Signed In'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Box>
    <List>
      <ListItem button component={Link} to='/' onClick={handleClick}>
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemIcon><InboxIcon /></ListItemIcon>
        <ListItemText primary="Inbox" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to='/search' onClick={handleClick}>
        <ListItemIcon><SearchIcon /></ListItemIcon>
        <ListItemText primary="Search" />
      </ListItem>
      <Divider />
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{user ? <LogoutIcon /> : <LoginIcon />}</ListItemIcon>
        <ListItemText primary={user ? 'Sign Out' : 'Sign In'} />
      </ListItem>
    </List>
  </>);
}
