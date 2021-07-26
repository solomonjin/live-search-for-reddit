import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, CircularProgress
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
  }
});

export default function CommentDialog(props) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const classes = useStyles();

  const changeComment = event => {
    setComment(event.target.value);
  };

  const cancelComment = () => {
    props.onClose();
    setComment('');
    setLoading(false);
    setSuccess(false);
  };

  const sendComment = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    const userComment = {
      comment,
      submissionId: props.submissionId
    };
    const req = {
      method: 'post',
      body: JSON.stringify(userComment),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/comment', req)
      .then(res => res.json())
      .then(comment => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          props.onClose();
          setSuccess(false);
          setComment('');
        }, 1000);
      })
      .catch(err => console.error(err));
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
      <DialogActions>
        <Button color="secondary" onClick={cancelComment}>Cancel</Button>
        <div className={classes.wrapper}>
          <Button
            color="primary"
            onClick={sendComment}
            className={classes.sendButton}
            disabled={loading}
          >
            {success ? <CheckIcon color="primary" /> : 'Send'}
            {loading && <CircularProgress size={24} className={classes.buttonLoading} />}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
