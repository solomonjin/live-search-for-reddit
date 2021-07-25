import React, { useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import AppContext from '../lib/app-context';

export default function SearchMessage(props) {
  const { searchResults } = useContext(AppContext);

  const message = searchResults
    ? `${searchResults.length} submissions found.`
    : 'No active searches. Begin by searching for submisisons';

  return (
    <Grid container
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12}>
        <Typography align='center' variant='h5'>{message}</Typography>
      </Grid>
    </Grid>
  );
}
