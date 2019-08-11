import {
  CHANGE_ODDS_DISPLAY,
  CURRENT_SUBSCRIPTIONS,
  LIVE_EVENTS_DATA,
  EVENT_DATA,
  MARKET_DATA,
  OUTCOME_DATA,
  PRICE_CHANGE,
  MARKET_STATUS,
  OUTCOME_STATUS,
  ADD_TO_BET_SLIP,
  REMOVE_BET,
  CLEAR_BET_SLIP,
  ERROR, BET_AMOUNT_CHANGE,
} from '../actions/eventsActions';
import { sortBy } from 'lodash';

const defaultState = {
  oddsDisplay: 'fractional',
  subscriptions: [],
  liveEvents: [],
  betSlip: [],
  error: null,
};

const eventsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TO_BET_SLIP:
      const betSlip = [...state.betSlip];
      betSlip.push(action.payload.data);
      return {
        ...state,
        betSlip,
      };
    case REMOVE_BET:
      const betSlipCollection = [...state.betSlip];
      const toBeRemoved = action.payload.data;
      const betIndex = betSlipCollection.findIndex((bet) =>
        bet.eventId === toBeRemoved.eventId
        && bet.marketId === toBeRemoved.marketId
        && bet.outcomeId === toBeRemoved.outcomeId);
      betSlipCollection.splice(betIndex, 1);
      return {
        ...state,
        betSlip: betSlipCollection,
      };
    case CLEAR_BET_SLIP:
      return {
        ...state,
        betSlip: [],
      };
    case BET_AMOUNT_CHANGE:
      let betSlipToUpdate = [...state.betSlip];
      const updatedBet = action.payload.data;
      betSlipToUpdate = betSlipToUpdate.reduce((acc, bet) => {
        if (bet.eventId === updatedBet.eventId
          && bet.marketId === updatedBet.marketId
          && bet.outcomeId === updatedBet.outcomeId) {

          bet.amount = updatedBet.amount;
        }
        acc.push(bet);
        return acc;
      }, []);
      return {
        ...state,
        betSlip: betSlipToUpdate,
      };
    case CHANGE_ODDS_DISPLAY:
      return {
        ...state,
        oddsDisplay: action.payload.data,
      };
    case CURRENT_SUBSCRIPTIONS:
      return {
        ...state,
        subscriptions: action.payload.data,
      };
    case LIVE_EVENTS_DATA:
      return {
        ...state,
        liveEvents: action.payload.data,
      };
    case EVENT_DATA:
      const liveEvents = [...state.liveEvents];
      const eventIndex = liveEvents.findIndex(event => event.eventId === action.payload.data.eventId);
      if (eventIndex !== -1) {
        liveEvents[eventIndex] = Object.assign({}, action.payload.data, { marketData: []}) ;
      } else {
        liveEvents.push(Object.assign({}, action.payload.data, { marketData: []}));
      }

      return {
        ...state,
        liveEvents,
      };
    case MARKET_DATA:
      const lvEvents = state.liveEvents.reduce((acc, event) => {
        if (event.eventId === action.payload.data.eventId) {
          if (!event.marketData) {
            event.marketData = [];
          }
          const mrkIndex = event.marketData.findIndex(mrk => mrk.marketId === action.payload.data.marketId);
          if (mrkIndex !== -1) {
            event.marketData[mrkIndex] = action.payload.data;
          } else {
            event.marketData.push(action.payload.data);
          }
          event.marketData = sortBy(event.marketData, ['displayOrder', 'name']);
        }
        acc.push(event);
        return acc;
      }, []);
      return {
        ...state,
        liveEvents: lvEvents,
      };
    case OUTCOME_DATA:
      const event = [...state.liveEvents].find(evt => evt.eventId === action.payload.data.eventId);
      const evtIndex = [...state.liveEvents].findIndex(evt => evt.eventId === action.payload.data.eventId);
      const events = [...state.liveEvents];
      if (event.marketData) {
        const market = event.marketData.find(mkt => mkt.marketId === action.payload.data.marketId);
        const marketIndex = event.marketData.findIndex(mkt => mkt.marketId === action.payload.data.marketId);
        market.outcomes[market.outcomes.findIndex(otc => otc === action.payload.data.outcomeId)] = action.payload.data;
        event.marketData[marketIndex] = market;
      }
      events[evtIndex] = event;
      return {
        ...state,
        liveEvents: events,
      };
    case MARKET_STATUS:
      const lvstateEvents = state.liveEvents.reduce((acc, event) => {
        if (event.eventId === action.payload.data.eventId) {
          if (event.marketData) {
            const mrkIndex = event.marketData.findIndex(mrk => mrk.marketId === action.payload.data.marketId);
            event.marketData[mrkIndex].status = action.payload.data.status;
          }
        }
        acc.push(event);
        return acc;
      }, []);
      return {
        ...state,
        liveEvents: lvstateEvents,
      };
    case PRICE_CHANGE:
    case OUTCOME_STATUS:
      const outStatusEvent = [...state.liveEvents].find(evt => evt.eventId === action.payload.data.eventId);
      const outStatusEvtIndex = [...state.liveEvents].findIndex(evt => evt.eventId === action.payload.data.eventId);
      const outStatusEvents = [...state.liveEvents];
      let betSlipToUpdateOnOutcomeChange = [...state.betSlip];
      if (outStatusEvent && outStatusEvtIndex !== -1 && outStatusEvent.marketData) {
        const market = outStatusEvent.marketData.find(mkt => mkt.marketId === action.payload.data.marketId);
        const marketIndex = outStatusEvent.marketData.findIndex(mkt => mkt.marketId === action.payload.data.marketId);
        const outIndex = market.outcomes.findIndex(otc => otc === action.payload.data.outcomeId);
        market.outcomes[outIndex] = {
          ...market.outcomes[outIndex],
          ...action.payload.data,
        };
        outStatusEvent.marketData[marketIndex] = market;

        const updatedBet = action.payload.data;
        betSlipToUpdateOnOutcomeChange = betSlipToUpdateOnOutcomeChange.reduce((acc, bet) => {
          if (bet.eventId === updatedBet.eventId
            && bet.marketId === updatedBet.marketId
            && bet.outcomeId === updatedBet.outcomeId) {

            bet = {...bet, ...updatedBet};
          }
          acc.push(bet);
          return acc;
        }, []);
      }
      outStatusEvents[outStatusEvtIndex] = outStatusEvent;
      return {
        ...state,
        liveEvents: outStatusEvents,
        betSlip: betSlipToUpdateOnOutcomeChange,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state
  }
};

export default eventsReducer;
