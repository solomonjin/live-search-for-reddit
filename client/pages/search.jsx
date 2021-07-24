import React from 'react';
import { Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    paddingTop: '65px'
  }
});

export default function Search(props) {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="xl">
      <Box sx={{ pb: 5 }}>
        <div>SEARCH PAGE</div>
      </Box>
    </Container>
  );
}
