import React from 'react';
import DOMPurify from 'dompurify';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    overflowWrap: 'break-word'
  }
}));

export default function SubmissionBody(props) {
  const classes = useStyles();

  if (!props.text) return (<></>);
  const clean = DOMPurify.sanitize(props.text);
  return <Typography
            className={classes.root}
            variant="body2"
            dangerouslySetInnerHTML={{ __html: clean }} />;
}
