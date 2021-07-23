import React, { useContext } from 'react';
import { Grid, Typography, makeStyles, Button } from '@material-ui/core';
import AppContext from '../lib/app-context';
import RedditLogo from './reddit-logo';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #A3D8F7 30%, #C5CFF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(197, 207, 243, .3)',
    height: 48,
    padding: '0 30px',
    color: '#393E41',
    marginTop: 30
  }
});

export default function SignInButton(props) {
  const classes = useStyles();
  const { handleSignIn } = useContext(AppContext);

  return (
    <Grid container
          alignItems="center"
          justifyContent="center"
    >
      <Grid item xs={12}>
        <Typography align='center' variant='h5'>{'This app requires authorization from the user\'s Reddit account'}</Typography>
      </Grid>
      <Grid item xs align="center">
        <Button className={classes.root} startIcon={<RedditLogo />} onClick={handleSignIn}>
          SIGN IN
        </Button>
      </Grid>
    </Grid>
  );
}
