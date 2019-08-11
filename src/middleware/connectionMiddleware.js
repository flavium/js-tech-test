import * as appActions from '../store/actions/appActions';
import wsConnection from '../core/wsConnection';

const defaultOptions = {
  reconnectInterval: 2000,
};

export default (newOptions) => {
  const options = { ...defaultOptions, ...newOptions };

  // Create a new redux websocket instance.
  const ws = new wsConnection(options);

  // Define the list of handlers, now that we have an instance of websocket.
  const handlers = {
    [appActions.WEBSOCKET_CONNECT]: ws.connect,
    [appActions.WEBSOCKET_DISCONNECT]: ws.disconnect,
    [appActions.WEBSOCKET_SEND]: ws.send,
  };

  // Middleware function.
  return (store) => next => (action) => {
    const { dispatch } = store;
    const { type: actionType } = action;

    if (actionType) {
      const handler = Reflect.get(handlers, actionType);

      if (handler) {
        try {
          handler(store, action);
        } catch (err) {
          dispatch(appActions.error(action, err));
          throw {type: actionType, err};
        }
      }
    }

    return next(action);
  };
};
