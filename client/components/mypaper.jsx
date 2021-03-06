
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    background: '#f9f9f9',
    borderRadius: 8,
    color: '#393e41'
  }
});

export default function MyPaper(props) {
  const classes = useStyles();
  return (
  <Paper
    elevation={props.elevation}
    className={`${classes.root} ${props.className}`}
    onClick={props.onClick}
    >
    {props.children}
  </Paper>
  );
}
