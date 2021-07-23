import React from 'react';
import MyPaper from '../components/mypaper';
import { Grid, Box } from '@material-ui/core';
import SearchMessage from '../components/search-message';

export default function Home(props) {
  return (
    <Grid container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={9} sm={6} md={4}>
        <MyPaper elevation={3}>
          <Box p={3}>
            <SearchMessage />
          </Box>
        </MyPaper>
      </Grid>
    </Grid>
  );
}
