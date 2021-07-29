import React, { useState } from 'react';
import {
  Dialog, DialogTitle,
  DialogActions, Button, CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';

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
