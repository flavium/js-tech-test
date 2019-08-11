import React from 'react';
import { connect } from 'react-redux';
import {
  getLiveEvents,
  getEventMarket,
  getMarketOutcome,
  addToBetSlip,
  eventsConst,
} from '../store/actions/eventsActions';
import {
  CircularProgress,
  Grid, Typography,
} from '@material-ui/core';
import EventItem from '../components/EventItem';

class EventsContainer extends React.Component{

  componentWillMount() {
    if (this.props.liveEvents.length < 2) {
      this.props.getLiveEvents();
    }
  }

  groupEvents = (events) => {
    return events.reduce((acc, event) => {
      const eventType = event.linkedEventTypeName || event.typeName;
      if (!acc.hasOwnProperty(eventType)) {
        acc[eventType] = [];
        acc[eventType].push(event);
      } else {
        acc[eventType].push(event);
      }
      return acc;
    }, {});
  };

  render() {
    const { liveEvents, getEventMarket, getMarketOutcome, oddsDisplay, addToBetSlip } = this.props;
    const groupedEvents = this.groupEvents(liveEvents);
    return !liveEvents.length
      ? <CircularProgress className='CircularProgress' variant='indeterminate' thickness={3} size={50} />
      : <Grid container={true}>
        {
          Object.keys(groupedEvents).map(type =>
            <Grid key={type} container={true} item={true}>
              <Grid className='EventTypeName' item={true} xs={12}>
                <Typography variant='h5'>{type}</Typography>
              </Grid>
              {
                groupedEvents[type].map((eventItem, index) =>
                  <EventItem
                    key={index}
                    eventItem={eventItem}
                    defaultTime='2017-09-19T11:25:00.000Z'
                    oddsDisplay={oddsDisplay}
                    getEventMarket={getEventMarket}
                    getMarketOutcome={getMarketOutcome}
                    addToBetSlip={(payload) => addToBetSlip({
                      eventId: eventItem.eventId,
                      eventName: eventItem.name,
                      ...payload
                    })}
                  />
                )
              }
            </Grid>
          )
        }
      </Grid>;
  }
}

const mapStateToProps = state => ({
  liveEvents: state[eventsConst.STORE_ID].liveEvents,
  oddsDisplay: state[eventsConst.STORE_ID].oddsDisplay,
});

const mapDispatchToProps = dispatch => ({
  getLiveEvents: () => dispatch(getLiveEvents()),
  getEventMarket: (id) => dispatch(getEventMarket(id)),
  getMarketOutcome: (payload) => dispatch(getMarketOutcome(payload)),
  addToBetSlip: (payload) => dispatch(addToBetSlip(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsContainer);
