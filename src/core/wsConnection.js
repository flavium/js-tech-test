import {
  beginReconnect,
  broken,
  closed,
  error,
  message,
  open,
  reconnectAttempt,
  reconnected,
  connect,
  send,
  disconnect,
} from '../store/actions/appActions';

export default class wsConnection {
  options = {};
  websocket = null;
  reconnectCount = 0;
  reconnectionInterval = null;
  lastSocketUrl = null;
  hasOpened = false;

  constructor(options) {
    this.options = options;
  }

  connect = ({ dispatch }, { payload }) => {
    this.close();
    this.lastSocketUrl = payload.url;
    this.websocket = new WebSocket(payload.url);
    this.websocket.addEventListener('close', event => this.handleClose(dispatch, event));
    this.websocket.addEventListener('error', (err) => this.handleError(dispatch, err));
    this.websocket.addEventListener('open', (event) => {
      this.handleOpen(dispatch, this.options.onOpen, event);
    });
    this.websocket.addEventListener('message', event => this.handleMessage(dispatch, event));
  };

  disconnect = () => {
    if (this.websocket) {
      this.close();
    } else {
      throw new Error(
        'Socket connection not initialized. Dispatch WEBSOCKET_CONNECT first',
      );
    }
  };

  send = (_store, { payload }) => {
    if (this.websocket) {
      this.websocket.send(JSON.stringify(payload));
    } else {
      throw new Error(
        'Socket connection not initialized. Dispatch WEBSOCKET_CONNECT first',
      );
    }
  };

  handleClose = (dispatch, event) => {
    dispatch(closed(event));
  };

  handleError = (dispatch, err) => {
    dispatch(error(null, new Error('`redux-websocket` error')));
    // Only attempt to reconnect if the connection has ever successfully opened.
    // This prevents ongoing reconnect loops to connections that have not
    // successfully opened before, such as net::ERR_CONNECTION_REFUSED errors.
    if (this.hasOpened) {
      this.handleBrokenConnection(dispatch);
    }
  };

  handleOpen = (dispatch, onOpen, event) => {
    // Clean up any outstanding reconnection attempts.
    if (this.reconnectionInterval) {
      clearInterval(this.reconnectionInterval);

      this.reconnectionInterval = null;
      this.reconnectCount = 0;

      dispatch(reconnected());
    }

    // Hook to allow consumers to get access to the raw socket.
    if (onOpen && this.websocket != null) {
      onOpen(this.websocket);
    }

    // Now we're fully open and ready to send messages.
    dispatch(open(event));

    this.hasOpened = true;
  };

  handleMessage = (dispatch, event) => {
    dispatch(message(event));
  };

  close = (code, reason) => {
    if (this.websocket) {
      this.websocket.close(code || 1000, reason || 'WebSocket connection closed.');

      this.websocket = null;
      this.hasOpened = false;
    }
  };

  handleBrokenConnection = (dispatch) => {
    const { reconnectInterval } = this.options;

    this.websocket = null;

    // First, dispatch actions to notify Redux that connection broke.
    dispatch(broken());
    dispatch(beginReconnect());

    this.reconnectCount = 1;

    dispatch(reconnectAttempt(this.reconnectCount));

    // Attempt to reconnect immediately by calling connect with assertions
    // that the arguments conform to the types we expect.
    this.connect(dispatch, { url: this.lastSocketUrl });

    // Attempt reconnecting on an interval.
    this.reconnectionInterval = setInterval(() => {
      this.reconnectCount += 1;

      dispatch(reconnectAttempt(this.reconnectCount));

      // Call connect again, same way.
      this.connect({ dispatch }, { payload: { url: this.lastSocketUrl }});
    }, reconnectInterval);
  }
};

export {
  connect,
  disconnect,
  send,
};
