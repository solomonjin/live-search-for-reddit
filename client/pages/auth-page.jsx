import React from 'react';
import { Grid, Paper, Box } from '@material-ui/core';
import SignInButton from '../components/sign-in-button';

export default function AuthPage(props) {
  return (
    <Grid container
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
    >
      <Grid item xs={9} sm={6} md={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <SignInButton />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
