import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

export default function NetworkAlert(props) {
  return (
    <Snackbar open={props.open}>
      <Alert severity="error">
        <AlertTitle>Network Error Occured</AlertTitle>
        Please try again later.
      </Alert>
    </Snackbar>
  );
}
