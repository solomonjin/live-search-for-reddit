import React, { useState } from 'react';
import {
  IconButton, TextField, Grid, ClickAwayListener,
  FormControl, Slide, makeStyles, Button
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
  },
  form: {
    width: '100%'
  },
  button: {
    background: 'linear-gradient(45deg, #A3D8F7 30%, #C5CFF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(197, 207, 243, .3)',
    color: '#393E41'
  }
}));

export default function SearchForm(props) {
  const [isOpen, setOpen] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [subs, setSubs] = useState('');
  const [toggleInbox, setToggleInbox] = useState(false);

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

  const changeKeywords = event => {
    setKeywords(event.target.value);
  };

  const changeSubs = event => {
    setSubs(event.target.value);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <IconButton onClick={handleOpen}>
          <SearchIcon />
        </IconButton>

        <Slide direction="down" in={isOpen} mountOnEnter>
          <div className={classes.root}>
            <FormControl className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center" justifyContent="space-evenly">
                <Grid item xs={12} sm={10} align="center">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth required
                        variant="outlined" label="Keywords"
                        placeholder="Separated by commas"
                        onChange={changeKeywords} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth required
                        variant="outlined" label="Subreddits"
                        placeholder="Separated by commas"
                        onChange={changeSubs} />
                    </Grid>
                    <Grid item xs={12}>

                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={1} align="end">
                  <Grid container justifyContent="center">
                    <Button className={classes.button}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </FormControl>
          </div>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
