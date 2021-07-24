import React, { useContext } from 'react';
import { Container, Box, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AppContext from '../lib/app-context';

const useStyles = makeStyles({
  root: {
    paddingTop: '65px'
  },
  hideProgress: {
    visibility: 'hidden'
  }
});

export default function Search(props) {
  const { searchResults, isSearching } = useContext(AppContext);
  const classes = useStyles();

  const searching = isSearching
    ? <LinearProgress />
    : <LinearProgress className={classes.hideProgress} />;

  return (
    <Container className={classes.root} maxWidth="xl">
      <Box>
        <div>SEARCH PAGE</div>
      </Box>
      {searching}
    </Container>
  );
}
