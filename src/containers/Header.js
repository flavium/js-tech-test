import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import {
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';
import logo from '../static/logo.png';
import BetSlip from '../components/BetSlip';

function Header (props) {
  const { eventType, odsDisplay, changeOdsDisplay } = props;
  const classes = useStyles();

  return (
    <Grid container={true} className='Header'>
      <Grid item={true} xs={3}>
        <Typography variant='h6' noWrap={true}>{eventType}</Typography>
      </Grid>
      <Grid item={true} xs={6}>
        <img alt='SkyBet' className='Logo' src={logo} />
      </Grid>
      <Grid item={true} xs={3}>
        <Typography className='OddsDisplaySelector' variant='caption' noWrap={true}>View odds: </Typography>
        <Select
          className='OddsDisplaySelector'
          classes={{root: classes.rootSelector, icon: classes.iconSelector }}
          value={odsDisplay}
          onChange={changeOdsDisplay}
          disableUnderline={true}
        >
          <MenuItem value={'fractional'}>fractional</MenuItem>
          <MenuItem value={'decimal'}>decimal</MenuItem>
        </Select>
        <BetSlip />
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  eventType: PropTypes.string,
  odsDisplay: PropTypes.string,
  changeOdsDisplay: PropTypes.func,
};

const useStyles = makeStyles(() =>
  createStyles({
    rootSelector: {
      color: 'aliceblue',
      fontSize: '0.75em',
      paddingRight: '0  ',
    },
    iconSelector: {
      color: 'aliceblue',
    }
  }),
);

export default Header;
