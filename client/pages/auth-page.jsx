import React from 'react';
import { Grid, Box } from '@material-ui/core';
import SignInButton from '../components/sign-in-button';
import MyPaper from '../components/mypaper';

export default function AuthPage(props) {
  return (
    <Grid container
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
    >
      <Grid item xs={9} sm={6} md={4}>
        <MyPaper elevation={3}>
          <Box p={3}>
            <SignInButton />
          </Box>
        </MyPaper>
      </Grid>
    </Grid>
  );
}
