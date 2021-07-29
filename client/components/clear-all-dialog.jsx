import React, { useContext } from 'react';
import {
  Dialog, DialogTitle,
  DialogActions, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../lib/app-context';

const useStyles = makeStyles({
  wrapper: {
    position: 'relative'
  },
  mb30: {
    marginBottom: '30px'
  },
  justifyEven: {
    justifyContent: 'space-evenly'
  }
});

export default function ClearAllDialog(props) {
  const classes = useStyles();
  const { setSearchResults } = useContext(AppContext);

  const clearAllResults = () => {
    setSearchResults([]);
    props.onClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ style: { borderRadius: 8 } }}
    >
      <DialogTitle className={classes.mb30} align="center">Clear all search results?</DialogTitle>
      <DialogActions className={classes.justifyEven}>
        <Button onClick={props.onClose} color="secondary">Cancel</Button>
        <Button
          color="primary"
          className={classes.sendButton}
          onClick={clearAllResults}
        >
          {'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
