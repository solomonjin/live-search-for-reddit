import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button
} from '@material-ui/core';

export default function CommentDialog(props) {
  const [comment, setComment] = useState('');

  const changeComment = event => {
    setComment(event.target.value);
  };

  const cancelComment = () => {
    props.onClose();
    setComment('');
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ style: { borderRadius: 8 } }}
    >
      <DialogTitle align="center">Post Comment</DialogTitle>
      <DialogContent>
        <TextField fullWidth required
          variant="outlined" label="Comment"
          onChange={changeComment}
          multiline rows={4}
          value={comment}
        />
      </DialogContent>
      <DialogActions justifyContent="center">
        <Button color="secondary" onClick={cancelComment}>Cancel</Button>
        <Button color="primary">Send</Button>
      </DialogActions>
    </Dialog>
  );
}
