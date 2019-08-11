import {
  WEBSOCKET_BROKEN,
  WEBSOCKET_CLOSED,
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_OPEN,
  WEBSOCKET_SEND,
  WEBSOCKET_ERROR,
} from '../actions/appActions';

const defaultState = {
  connected: false,
  messages: [],
  url: null,
};


const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      return {
        ...state,
        url: action.payload.url,
      };
    case WEBSOCKET_OPEN:
      return {
        ...state,
        connected: true,
      };
    case WEBSOCKET_BROKEN:
    case WEBSOCKET_CLOSED:
      return {
        ...state,
        connected: false,
      };
    case WEBSOCKET_MESSAGE:
      return {
        ...state,
        /*messages: [
          ...state.messages,
          {
            data: JSON.parse(action.payload.message),
            origin: action.payload.origin,
            timestamp: action.meta.timestamp,
            type: 'INCOMING',
          },
        ],*/
      };
    case WEBSOCKET_SEND:
      return {
        ...state,
        /*messages: [
          ...state.messages,
          {
            data: action.payload,
            origin: window.location.origin,
            timestamp: new Date(),
            type: 'OUTGOING',
          },
        ],*/
      };
    case WEBSOCKET_DISCONNECT:
      return {
        ...state,
        connected: false,
      };
    case WEBSOCKET_ERROR:
      const error = action.payload;
      return {
        ...state,
        error,
      };
    default:
      return state
  }
};

export const getConnected = (state) => state.connected;

export default appReducer
