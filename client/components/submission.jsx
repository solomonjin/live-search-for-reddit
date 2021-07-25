import React from 'react';
import { Grid, Box, IconButton, Typography } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DeleteIcon from '@material-ui/icons/Delete';

export default function Submission(props) {
  return (
    <Box p={2}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {props.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            {`Posted by ${props.author} in ${props.sub}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            {props.date}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="space-evenly" alignItems="center">
            <Grid item xs>
              <IconButton>
                <MailIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <IconButton>
                <InsertCommentIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <IconButton>
                <OpenInNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
