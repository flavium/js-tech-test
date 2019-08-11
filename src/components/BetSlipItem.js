import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Grid,
  Typography,
  TextField,
} from '@material-ui/core';
import { getOdds } from '../utils/utils';
import { debounce } from 'lodash';

function BetSlipItem(props) {
  const { bet, oddsDisplay, onRemove, onChange } = props;

  const onFieldChange = (e) => {
    e.persist();
    debouncedUpdate(e);
  };

  const onFieldUpdate = (e) => {
    onChange({
      eventId: bet.eventId,
      marketId: bet.marketId,
      outcomeId: bet.outcomeId,
      amount: e.target.value,
    });
  };

  const debouncedUpdate = debounce(onFieldUpdate, 1000);

  return (
    <Grid container={true} item={true} xs={12}>
      <Grid className='BetTitle' item={true} xs={12}>
        <Typography variant='caption'>{`${bet.eventName} - ${bet.marketName}`}</Typography>
        <Button className='BetRemoveButton' onClick={() => onRemove(bet)}>
          x
        </Button>
      </Grid>
      <Grid className='BetInfo' item={true} xs={12}>
        <Typography variant='caption'>{`${bet.outcomeName} @ ${getOdds({price: bet.price}, oddsDisplay)}`}</Typography>
        <TextField
          className='BetAmount'
          value={bet.amount}
          disabled={!bet.status.active || bet.status.suspended}
          onChange={(e) => onFieldChange(e)}
        />
      </Grid>
    </Grid>
  );
}

BetSlipItem.defaultProps = {
  bet: {},
  oddsDisplay: 'fractional',
};

BetSlipItem.propTypes = {
  bet: PropTypes.object,
  oddsDisplay: PropTypes.string,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default BetSlipItem
