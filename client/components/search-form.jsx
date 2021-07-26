import React, { useContext } from 'react';
import {
  IconButton, TextField, Grid, ClickAwayListener,
  FormControlLabel, Slide, makeStyles, Button,
  Switch
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AppContext from '../lib/app-context';

const useStyles = makeStyles(theme => ({
  root: {
    top: 0,
    left: 0,
    zIndex: 99,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: 300,
    width: '100%',
    padding: '30px 10px',
    boxShadow: '0 2px 3px 2px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
    color: '#393e41',
    [theme.breakpoints.up('sm')]: {
      height: 140,
      padding: '10px'
    }
  },
  form: {
    width: '100%'
  },
  button: {
    background: 'linear-gradient(45deg, #A3D8F7 30%, #C5CFF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(197, 207, 243, .3)',
    color: '#393E41'
  },
  switch: {
    palette: {
      primary: '#A3D8F7'
    }
  }
}));

export default function SearchForm(props) {
  const {
    submitSearch,
    keywords,
    changeKeywords,
    subreddits,
    changeSubs,
    changeInbox,
    toggleInbox,
    openSearchForm,
    closeSearchForm,
    searchFormOpen
  } = useContext(AppContext);

  const classes = useStyles();

  return (
    <ClickAwayListener onClickAway={closeSearchForm}>
      <div>
        <IconButton onClick={openSearchForm}>
          <SearchIcon />
        </IconButton>

        <Slide direction="down" in={searchFormOpen} mountOnEnter>
          <div className={classes.root}>
            <form className={classes.form} onSubmit={submitSearch}>
              <Grid container spacing={3} alignItems="center" justifyContent="space-evenly">
                <Grid item xs={12} sm={10} align="center">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth required
                        variant="outlined" label="Keywords"
                        placeholder="Separated by commas"
                        onChange={changeKeywords} value={keywords} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth required
                        variant="outlined" label="Subreddits"
                        placeholder="Separated by commas"
                        onChange={changeSubs} value={subreddits} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch color="primary" className={classes.switch} checked={toggleInbox} onChange={changeInbox} name="inboxSetting" />}
                        label="Send to Inbox" />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={1} align="end">
                  <Grid container justifyContent="center">
                    <Button className={classes.button} type="submit">
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </div>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
