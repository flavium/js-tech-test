import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Chip,
  Collapse,
  Grid,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Market from './Market';
import {
  getTime,
  getCompetitor,
  getScore
} from '../utils/utils';

function EventItem(props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    eventItem,
    defaultTime,
    getEventMarket,
    getMarketOutcome,
    oddsDisplay,
    history,
    addToBetSlip,
  } = props;

  useEffect(
    () => {
      if (eventItem.marketData && eventItem.marketData[0].outcomes
        && eventItem.marketData[0].outcomes.every(out => typeof out === 'number')) {
        getMarketOutcome(eventItem.marketData[0].outcomes);
      }
    },
    [eventItem]
  );

  const toggleMarket = (e) => {
    e.stopPropagation();
    if (!collapsed && !eventItem.marketData) {
      getEventMarket(eventItem.markets[0]);
    }
    setCollapsed(!collapsed);
  };

  if (!eventItem.status.displayable) {
    return null;
  }
  return (
    <React.Fragment>
      <Grid className='EventContainer' container={true} item={true} xs={12} onClick={() => history.push(`event/${eventItem.eventId}`)}>
        <Grid className='TimeContainer' item={true} xs={2}>{`${getTime(eventItem, defaultTime)}'`}</Grid>
        <Grid item={true} xs={8}>
          <Typography variant='body1'>
            {`${getCompetitor(eventItem, 'home')} vs ${getCompetitor(eventItem, 'away')}`}
          </Typography>
        </Grid>
        <Grid className='ScoreContainer' item={true} xs={2}>
          <Chip className='ScoreChip' label={`${getScore(eventItem, 'home')} - ${getScore(eventItem, 'away')}`} />
          <Button className='MarketButton' onClick={(e) => toggleMarket(e)}>
            <FontAwesomeIcon icon={!collapsed ? 'chevron-down' : 'chevron-up'}/>
          </Button>
        </Grid>
      </Grid>
      <Collapse className='EventPrimaryMarketContainer' in={collapsed} collapsedHeight='0px'>
        <Market
          market={eventItem.marketData && eventItem.marketData[0]}
          oddsDisplay={oddsDisplay}
          collapsedOutcomes={false}
          getMarketOutcome={getMarketOutcome}
          addToBetSlip={(payload) => addToBetSlip({
            ...payload,
            eventId: eventItem.eventId,
            eventName: eventItem.name,
          })}
        />
      </Collapse>
    </React.Fragment>
  );
}

EventItem.defaultProps = {
  eventItem: null,
  defaultTime: null,
  notCollapsed: false,
  oddsDisplay: '',
};

EventItem.propTypes = {
  eventItem: PropTypes.object,
  defaultTime: PropTypes.string,
  oddsDisplay: PropTypes.string,
  getEventMarket: PropTypes.func,
  getMarketOutcome: PropTypes.func,
  addToBetSlip: PropTypes.func,
};

export default withRouter(EventItem);
