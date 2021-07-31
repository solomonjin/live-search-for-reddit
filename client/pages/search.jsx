import React, { useContext, useState } from 'react';
import { Container, Box, LinearProgress, Grid, Typography, Fade, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { MyPaper, SearchMessage, Submission, CancelDialog, ClearAllDialog, VolumeControl } from '../components';
import AppContext from '../lib/app-context';

const useStyles = makeStyles({
  root: {
    paddingTop: '65px',
    paddingLeft: 0,
    paddingRight: 0
  },
  searchText: {
    opacity: '50%'
  },
  hideProgress: {
    visibility: 'hidden'
  },
  button: {
    marginLeft: '10px'
  }
});

export default function Search(props) {
  const { searchResults, isSearching, keywords } = useContext(AppContext);
  const [toggleCancel, setToggleCancel] = useState(false);
  const [toggleClearAll, setToggleClearAll] = useState(false);
  const classes = useStyles();

  const openCancelMessage = () => {
    setToggleCancel(true);
  };

  const closeCancelMessage = () => {
    setToggleCancel(false);
  };

  const openClearAll = () => {
    setToggleClearAll(true);
  };

  const closeClearAll = () => {
    setToggleClearAll(false);
  };

  const searching = isSearching
    ? <LinearProgress />
    : <LinearProgress className={classes.hideProgress} />;

  const message = isSearching
    ? 'Searching...'
    : 'Results';

  if (!isSearching && searchResults.length === 0) {
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

  const submissions = searchResults.length > 0
    ? (
    <Fade in>
      <Grid container spacing={3}>
        {searchResults.map(post =>
          <Grid item sm={12} md={6} key={post.id}>
            <Submission
              title={post.title}
              author={post.author}
              sub={post.subreddit_name_prefixed}
              date={post.created_utc}
              text={post.selftext_html}
              url={post.url}
              keywords={keywords}
              submissionId={post.id}
            />
          </Grid>
        )}
      </Grid>
    </Fade>
      )
    : <></>;

  return (
    <Fade in>
      <Container className={classes.root} maxWidth="xl">
        <Grid container>
          <Grid item xs={6} md={8} />
          <Grid item xs={6} md={4}>
            <VolumeControl />
          </Grid>
        </Grid>
        <Box mt={1} mb={1}>
          <Grid container justifyContent="space-between" alignItems="flex-end">
            <Grid item xs={2}>
              <Typography className={classes.searchText} variant="body1">{message}</Typography>
            </Grid>
            <Grid item xs>
              <Grid container justifyContent="flex-end">
                <Grid item align="end">
                  <Button className={classes.button} size="small"
                    variant="contained" color="primary"
                    onClick={openClearAll}
                  >
                    {'Clear All'}
                  </Button>
                  <ClearAllDialog open={toggleClearAll} onClose={closeClearAll} />

                  <Button
                    className={classes.button} size="small" variant="contained"
                    color="secondary" onClick={openCancelMessage}
                    >
                      {'Cancel'}
                  </Button>
                  <CancelDialog open={toggleCancel} onClose={closeCancelMessage} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {searching}
        <br />
        {submissions}
      </Container>
    </Fade>
  );
}
