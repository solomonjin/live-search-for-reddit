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
  },
  inputBox: {
    marginBottom: '10px'
  }
});

export default function MessageDialog(props) {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const classes = useStyles();

  const changeMessage = event => {
    setMessage(event.target.value);
  };

  const changeSubject = event => {
    setSubject(event.target.value);
  };

  const cancelMessage = () => {
    props.onClose();
    setMessage('');
    setSubject('');
    setLoading(false);
    setSuccess(false);
  };

  const sendMessage = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    const userMessage = {
      message,
      submissionId: props.submissionId
    };
    const req = {
      method: 'post',
      body: JSON.stringify(userMessage),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/message', req)
      .then(res => res.json())
      .then(comment => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          props.onClose();
          setSuccess(false);
          setMessage('');
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
      <DialogTitle align="center">Send Message</DialogTitle>
      <DialogContent>
        <TextField fullWidth required
          variant="outlined" label="Subject"
          onChange={changeSubject}
          value={subject}
          className={classes.inputBox}
        />
        <TextField fullWidth required
          variant="outlined" label="Message"
          onChange={changeMessage}
          multiline rows={4}
          value={message}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={cancelMessage}>Cancel</Button>
        <div className={classes.wrapper}>
          <Button
            color="primary"
            onClick={sendMessage}
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
