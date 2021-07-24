import React, { useState } from 'react';
import {
  IconButton, TextField, Grid, ClickAwayListener,
  FormControl, Slide, makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
    top: 0,
    left: 0,
    zIndex: 99,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: 375,
    width: '100%',
    padding: '30px 10px',
    boxShadow: '0 2px 3px 2px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
    color: '#393e41',
    [theme.breakpoints.up('sm')]: {
      height: 140,
      padding: '10px'
    }
  }
}));

export default function SearchForm(props) {
  const [isOpen, setOpen] = useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(!isOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <IconButton onClick={handleOpen}>
          <SearchIcon />
        </IconButton>

        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <div className={classes.root}>
            <FormControl onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="Keywords" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="Subreddits" />
                </Grid>
              </Grid>
            </FormControl>
          </div>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
