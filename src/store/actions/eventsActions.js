import { send } from '../../core/wsConnection';

export const CHANGE_ODDS_DISPLAY = 'CHANGE_ODDS_DISPLAY';
export const ADD_TO_BET_SLIP = 'ADD_TO_BET_SLIP';
export const REMOVE_BET = 'REMOVE_BET';
export const CLEAR_BET_SLIP = 'CLEAR_BET_SLIP';
export const BET_AMOUNT_CHANGE = 'BET_AMOUNT_CHANGE';
export const SUBSCRIBE = 'subscribe';
export const UNSUBSCRIBE = 'unsubscribe';
export const GET_EVENT = 'getEvent';
export const GET_MARKET = 'getMarket';
export const GET_OUTCOME = 'getOutcome';
export const GET_LIVE_EVENTS = 'getLiveEvents';
export const CURRENT_SUBSCRIPTIONS = 'CURRENT_SUBSCRIPTIONS';
export const LIVE_EVENTS_DATA = 'LIVE_EVENTS_DATA';
export const EVENT_DATA = 'EVENT_DATA';
export const MARKET_DATA = 'MARKET_DATA';
export const OUTCOME_DATA = 'OUTCOME_DATA';
export const PRICE_CHANGE = 'PRICE_CHANGE';
export const MARKET_STATUS = 'MARKET_STATUS';
export const OUTCOME_STATUS = 'OUTCOME_STATUS';
export const ERROR = 'ERROR';

export const eventsConst = {
  STORE_ID: 'events',
};

export function subscribe(keys =[]) {
  return send(
    {
      type: SUBSCRIBE,
      keys
    }
  );
}

export function unsubscribe(keys =[]) {
  return send(
    {
      type: UNSUBSCRIBE,
      keys
    }
  );
}

export function getLiveEvents(primaryMarkets = true) {
  return send(
    {
      type: GET_LIVE_EVENTS,
      primaryMarkets
    }
  );
}

export function getEvent(id) {
  return send(
    {
      type: GET_EVENT,
      id
    }
  );
}

export function getEventMarket(payload) {
  if (typeof payload === 'object') {
    return dispatch => {
      payload.forEach(id => dispatch(send({
        type: GET_MARKET,
        id,
      })));
    }
  }
  return send(
    {
      type: GET_MARKET,
      id: payload,
    }
  );
}

export function getMarketOutcome(payload) {
  if (typeof payload === 'object') {
    return dispatch => {
      payload.forEach(id => dispatch(send({
        type: GET_OUTCOME,
        id,
      })));
    }
  }
  return send(
    {
      type: GET_OUTCOME,
      id: payload,
    }
  );
}

export function addToBetSlip(bet = {}) {
  return {
    type: ADD_TO_BET_SLIP,
    payload: {
      data: bet,
    }
  }
}

export function removeBet(bet = {}) {
  return {
    type: REMOVE_BET,
    payload: {
      data: bet,
    }
  }
}

export function clearBetSlip(bets = []) {
  return {
    type: CLEAR_BET_SLIP,
    payload: {
      data: bets,
    }
  }
}

export function changeOdsDisplay(odsDisplay) {
  return {
    type: CHANGE_ODDS_DISPLAY,
    payload: {
      data: odsDisplay,
    }
  }
}

export function betAmountChange(bet = {}) {
  return {
    type: BET_AMOUNT_CHANGE,
    payload: {
      data: bet,
    }
  }
}
