import React from 'react';
import { Grid, Typography } from '@material-ui/core';

export default function SearchMessage(props) {
  return (
    <Grid container
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12}>
        <Typography align='center' variant='h5'>{'No active searches. Begin by searching for submissions'}</Typography>
      </Grid>
    </Grid>
  );
}
