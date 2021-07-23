import React, { useContext } from 'react';
import { Paper, Box, Grid, Typography, List } from '@material-ui/core';
import RedditLogo from './reddit-logo';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../lib/app-context';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '90%',
    borderRadius: 20
  },
  toolbar: theme.mixins.toolbar
}));

export default function MyDrawer(props) {
  const classes = useStyles();
  const { user } = useContext(AppContext);

  return (
  <>
    <Box p={1}>
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
              <Typography align='center' noWrap variant='caption'>{`u/${user.user}`}</Typography>
            </Grid>

          </Grid>
        </Box>
      </Paper>
    </Box>
    <List>

    </List>
  </>);
}
