import React, { useState, useContext } from 'react';
import { IconButton, ClickAwayListener, Slider, Grid, Fade } from '@material-ui/core';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import AppContext from '../lib/app-context';

export default function VolumeControl(props) {
  const [toggleVolume, setToggleVolume] = useState(false);
  const [volume, setVolume] = useState(60);
  const { notifSound } = useContext(AppContext);

  const changeVolume = (event, newValue) => {
    setVolume(newValue);
    notifSound.current.volume = newValue / 100;
  };

  const handleClick = () => {
    setToggleVolume(!toggleVolume);
  };

  const closeControls = () => {
    setToggleVolume(false);
  };

  let volumeIcon;
  if (volume === 0) {
    volumeIcon = <VolumeMuteIcon />;
  } else if (volume <= 50) {
    volumeIcon = <VolumeDownIcon />;
  } else {
    volumeIcon = <VolumeUpIcon />;
  }

  return (
    <ClickAwayListener onClickAway={closeControls}>
      <Grid container justifyContent="flex-end" alignItems="center">
        <Grid item xs={2} align="center">
          <Fade in={toggleVolume}>
            <Slider
              value={volume}
              onChange={changeVolume}
            />
          </Fade>
        </Grid>
        <Grid item xs={1} align="center">
          <IconButton
            style={{ color: '#87ADCB' }}
            onClick={handleClick}
          >
            {volumeIcon}
          </IconButton>
        </Grid>
      </Grid>
    </ClickAwayListener>
  );
}
