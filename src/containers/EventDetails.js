import React from 'react';
import { connect } from 'react-redux';
import {
  isEqual,
  cloneDeep,
} from 'lodash';
import {
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  eventsConst,
  getEventMarket,
  getEvent,
  getMarketOutcome,
  subscribe,
  unsubscribe,
  addToBetSlip,
} from '../store/actions/eventsActions';
import {
  getTime,
  getCompetitor,
  getScore,
} from '../utils/utils';
import Market from '../components/Market';

class EventDetails extends React.Component {

  componentWillMount() {
    const eventId = Number(this.props.match.params.id);
    const eventItem = cloneDeep(this.props.liveEvents.find(event => event.eventId === eventId));
    if (!eventItem || (eventItem && eventItem.markets && eventItem.markets.length < 2)) {
      this.props.getEvent(eventId);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const eventId = Number(this.props.match.params.id);
    const eventItem = cloneDeep(this.props.liveEvents.find(event => event.eventId === eventId));
    const prevEventItem = prevProps.liveEvents.find(event => event.eventId === eventId);
    if (eventItem && !isEqual(eventItem, prevEventItem)
      && eventItem.marketData && eventItem.marketData.length < 2) {
      this.props.getEventMarket(eventItem.markets);
    }
  }

  componentWillUnmount() {
    this.props.unsubscribe(['e.*', 'm.*', 'o.*']);
  }

  render() {
    const { oddsDisplay, getMarketOutcome, liveEvents, match, subscribe, unsubscribe, addToBetSlip } = this.props;
    const eventItem = liveEvents.find(event => event.eventId === Number(match.params.id));
    if (!eventItem) {
      return null;
    }
    return (
      <Grid className='EventDetailsContainer' container={true}>
        <Grid className='EventContainerDetails' container={true} item={true} xs={12}>
          <Grid className='TimeContainerDetails' item={true} xs={12}>
            {`${getTime(eventItem, '2017-09-19T11:25:00.000Z')}'`}
          </Grid>
          <Grid className='CompetitorDetailsContainer' item={true} xs={12}>
            <Typography className='CompetitorDetails' variant='h6'>
              {getCompetitor(eventItem, 'home')}
            </Typography>
            <Chip className='ScoreChipDetails' label={getScore(eventItem, 'home')} />
          </Grid>
          <Grid className='CompetitorDetailsContainer' item={true} xs={12}>
            <Typography className='CompetitorDetails' variant='h6'>
              {getCompetitor(eventItem, 'away')}
            </Typography>
            <Chip className='ScoreChipDetails' label={getScore(eventItem, 'away')} />
          </Grid>
          <Grid item={true} xs={12}>
            <Divider className='DividerDetails' />
          </Grid>
          <Grid className='EventTypeNameDetails' item={true} xs={12}>
            <Typography variant='body2'>
              {eventItem.linkedEventTypeName || eventItem.typeName}
            </Typography>
          </Grid>
        </Grid>
        {
          eventItem.marketData && eventItem.marketData.length
          ? eventItem.marketData.map(market =>
              <Grid key={market.marketId} item={true} xs={12}>
                <Market
                  market={market}
                  oddsDisplay={oddsDisplay}
                  clickable={true}
                  collapsedOutcomes={false}
                  getMarketOutcome={getMarketOutcome}
                  subscribe={subscribe}
                  unsubscribe={unsubscribe}
                  addToBetSlip={(payload) => addToBetSlip({
                    ...payload,
                    eventId: eventItem.eventId,
                    eventName: eventItem.name,
                  })}
                />
              </Grid>)
           : <CircularProgress className='CircularProgress' variant='indeterminate' thickness={3} size={50} />
        }
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  liveEvents: state[eventsConst.STORE_ID].liveEvents,
  oddsDisplay: state[eventsConst.STORE_ID].oddsDisplay,
});

const mapDispatchToProps = dispatch => ({
  getEvent: (id) => dispatch(getEvent(id)),
  getEventMarket: (payload) => dispatch(getEventMarket(payload)),
  getMarketOutcome: (payload) => dispatch(getMarketOutcome(payload)),
  subscribe: (keys) => dispatch(subscribe(keys)),
  unsubscribe: (keys) => dispatch(unsubscribe(keys)),
  addToBetSlip: (payload) => dispatch(addToBetSlip(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
