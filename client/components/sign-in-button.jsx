import React from 'react';
import { Grid, Typography } from '@material-ui/core';

export default function SignInButton(props) {
  return (
    <Grid container
          alignItems="center"
          justifyContent="center"
    >
      <Grid item xs={12}>
        <Typography align='center' variant='h5'>{'This app requires authorization from the user\'s Reddit account'}</Typography>
      </Grid>
      <Grid item xs={3}>
        <button>SIGN IN</button>
      </Grid>
    </Grid>
  );
}
