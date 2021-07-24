import React, { useContext } from 'react';
import { Container, Box, LinearProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { MyPaper, SearchMessage } from '../components';
import AppContext from '../lib/app-context';

const useStyles = makeStyles({
  root: {
    paddingTop: '65px'
  },
  hideProgress: {
    visibility: 'hidden'
  },
  noSearch: {
    marginTop: '2rem'
  }
});

export default function Search(props) {
  const { searchResults, isSearching } = useContext(AppContext);
  const classes = useStyles();

  if (!isSearching && !searchResults) {
    return (
      <Grid container
        alignItems="center"
        justifyContent="center"
        style={{ height: '100vh' }}
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

  return (
    <Container className={classes.root} maxWidth="xl">
      <Box>
        <div>SEARCH PAGE</div>
      </Box>
      <LinearProgress />
    </Container>
  );
}
