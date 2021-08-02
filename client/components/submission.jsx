import React, { useState } from 'react';
import { Grid, Box, IconButton, Typography, Collapse } from '@material-ui/core';
import { MyPaper, SubmissionBody, CommentDialog, MessageDialog } from '.';
import { makeStyles } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import formatDate from '../lib/format-date';
import Highlighter from 'react-highlight-words';
import { parseKeywords } from '../../server/createSearchStream';

const useStyles = makeStyles({
  root: {
    color: '#393e41'
  },
  title: {
    lineHeight: '1.25em'
  },
  subtext: {
    opacity: '50%'
  },
  highlight: {
    color: '#ff4300',
    backgroundColor: 'transparent'
  },
  hover: {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.025)'
    }
  },
  hoverTitle: {
    width: '100%',
    '&:hover': {
      cursor: 'pointer'
    }
  }
});

export default function Submission(props) {
  const [toggleBody, setToggleBody] = useState(false);
  const [toggleComment, setToggleComment] = useState(false);
  const [messageBox, setMessageBox] = useState(false);
  const classes = useStyles();

  const toggleCollapse = () => {
    setToggleBody(!toggleBody);
  };

  const openCommentBox = () => {
    setToggleComment(true);
  };

  const closeCommentBox = () => {
    setToggleComment(false);
  };

  const openMessageBox = () => {
    setMessageBox(true);
  };

  const closeMessageBox = () => {
    setMessageBox(false);
  };

  return (
    <MyPaper className={classes.hover} elevation={3}>
      <Box p={2} pb={0}>
        <Grid container className={classes.root} spacing={2}>
          <Box className={classes.hoverTitle} onClick={toggleCollapse}>
            <Grid item xs={12}>
              <Typography className={classes.title} variant="h6">
                <Highlighter
                  highlightClassName={classes.highlight}
                  searchWords={parseKeywords(props.keywords)}
                  textToHighlight={props.title}
                  autoEscape
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subtext} variant="body2">
                {`Posted by u/${props.author} in ${props.sub}`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subtext} variant="body2">
                {formatDate(parseInt(props.date))}
              </Typography>
            </Grid>
          </Box>
          <Grid item xs={12} zeroMinWidth>
            <Collapse in={toggleBody}>
              <SubmissionBody text={props.text} />
            </Collapse>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-evenly">
              <Grid item xs align="center">
                <IconButton onClick={openMessageBox}>
                  <MailIcon color="primary" />
                </IconButton>
                <MessageDialog
                  open={messageBox}
                  onClose={closeMessageBox}
                  author={props.author}
                />
              </Grid>
              <Grid item xs align="center">
                <IconButton onClick={openCommentBox}>
                  <InsertCommentIcon color="primary" />
                </IconButton>
                <CommentDialog
                  open={toggleComment}
                  onClose={closeCommentBox}
                  submissionId={props.submissionId}
                />
              </Grid>
              <Grid item xs align="center">
                <IconButton target="_blank" href={props.url}>
                  <OpenInNewIcon color="primary" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MyPaper>
  );
}
