import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Drawer,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  eventsConst,
  removeBet,
  clearBetSlip,
  betAmountChange,
} from '../store/actions/eventsActions';
import BetSlipItem from './BetSlipItem';

function BetSlip(props) {
  const [isDrawerOpened, setDrawerOpen] = useState(false);
  const {
    betSlip,
    oddsDisplay,
    removeBet,
    clearBetSlip,
    betAmountChange,
  } = props;

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <React.Fragment>
      <Button className='BetSlipButton' onClick={toggleDrawer(true)}>
        Bet Slip
      </Button>
      <Drawer anchor='right' open={isDrawerOpened} onClose={toggleDrawer(false)}>
        <Grid className='BetSlipContainer' container={true} wrap={'wrap'}>
          <Grid className='BetSlipTitle' item={true} xs={12}>
            <Typography variant='h5'>Bets</Typography>
            <Typography variant='body1'>{`(${betSlip.length} selections)`}</Typography>
          </Grid>
          <Grid className='ClearBetSlipContainer' item={true} xs={12}>
            <Button onClick={() => clearBetSlip()}>Clear Slip</Button>
          </Grid>
          {
            !betSlip.length
            ? <Typography variant='body1'>no bets</Typography>
            : <Grid className='ActiveBetsContainer' container={true} item={true} xs={12}>
                {
                  betSlip.map(bet =>
                    <BetSlipItem
                      key={`${bet.eventId}_${bet.outcomeId}`}
                      bet={bet}
                      oddsDisplay={oddsDisplay}
                      onChange={betAmountChange}
                      onRemove={removeBet}
                    />
                  )
                }
                <Grid item={true}>
                  <Typography variant='h5'>{`Total stake: ${betSlip.reduce((acc, bet) => acc += Number(bet.amount) || 0, 0)}`}</Typography>
                </Grid>
              </Grid>
          }
        </Grid>
      </Drawer>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  betSlip: state[eventsConst.STORE_ID].betSlip,
  oddsDisplay: state[eventsConst.STORE_ID].oddsDisplay,
});

const mapDispatchToProps = dispatch => ({
  removeBet: (bet) => dispatch(removeBet(bet)),
  clearBetSlip: () => dispatch(clearBetSlip()),
  betAmountChange: (bet) => dispatch(betAmountChange(bet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BetSlip);
