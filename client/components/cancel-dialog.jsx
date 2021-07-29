import React, { useState, useContext } from 'react';
import {
  Dialog, DialogTitle,
  DialogActions, Button, CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import AppContext from '../lib/app-context';

const useStyles = makeStyles({
  wrapper: {
    position: 'relative'
  },
  buttonLoading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  mb30: {
    marginBottom: '30px'
  },
  justifyEven: {
    justifyContent: 'space-evenly'
  }
});

export default function CancelDialog(props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const classes = useStyles();
  const { mySocket, setMySocket, setIsSearching } = useContext(AppContext);

  const cancelSearch = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    mySocket.disconnect();
    setMySocket(null);

    const req = {
      method: 'delete'
    };

    fetch('/api/cancel', req)
      .then(result => result.json())
      .then(user => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          props.onClose();
          setSuccess(false);
          setIsSearching(false);
        }, 1000);
      });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ style: { borderRadius: 8 } }}
    >
      <DialogTitle className={classes.mb30} align="center">Cancel Search?</DialogTitle>
      <DialogActions className={classes.justifyEven}>
        <Button onClick={props.onClose} color="secondary">Cancel</Button>
        <div className={classes.wrapper}>
          <Button
            color="primary"
            onClick={cancelSearch}
            className={classes.sendButton}
            disabled={loading}
          >
            {success ? <CheckIcon color="primary" /> : 'Confirm'}
            {loading && <CircularProgress size={24} className={classes.buttonLoading} />}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
