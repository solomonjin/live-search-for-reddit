import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@material-ui/core';

export default function CommentDialog(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Post Comment</DialogTitle>
    </Dialog>
  );
}
