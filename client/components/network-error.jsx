import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

export default function NetworkAlert(props) {
  return (
    <Snackbar open={props.open}
      autoHideDuration={props.autoHideDuration}
      onClose={props.onClose}
    >
      <Alert
        severity="error"
        onClose={props.onClose}
      >
        <AlertTitle>Network Error Occured</AlertTitle>
        Please try again later.
      </Alert>
    </Snackbar>
  );
}
