import ErrorTracker, { errorCodes } from './error';
import { connect } from './wsConnection';
import connectionMiddleware from '../middleware/connectionMiddleware';
import { init as storeInit } from './store';

export default function appInitWithConfig({
                                            reconnectInterval = 2000,
                                            onlineRetryInterval = 2000,
                                            url = '',
                                            reducerList = {},
                                            onError = () => {},
                                          } = {}) {

  const connectionTimeOutId = setTimeout(() =>
      onError([new ErrorTracker('connection timeout', errorCodes.Error621)]),
    reconnectInterval);

  return ensureIsOnline(onlineRetryInterval, (err) => onError([err]))
    .then(() => {
      clearTimeout(connectionTimeOutId);
      const websocketMiddleware = connectionMiddleware({
        onOpen: (socket) => {
          window.__socket = socket;
        },
        onError: onError,
      });
      const store = storeInit(reducerList, [websocketMiddleware]);
      try {
        store.dispatch(connect(url));
        return Promise.resolve(store)
      } catch (err) {
        return Promise.reject(err);
      }
    })
    .catch((err) => {
      const error = err.type && err.type === 'CONNECT'
        ? new ErrorTracker(err, errorCodes.Error610)
        : new ErrorTracker(err);
      onError([error]);
      clearTimeout(connectionTimeOutId);
      return Promise.reject(error);
    });
}

export function ensureIsOnline(onlineRetryInterval, onTimeout) {
  return new Promise((resolve) => {
    let retryConnectionId = null;
    (function tryConnection() {
      if (window.navigator.onLine) {
        clearTimeout(retryConnectionId);
        resolve();
      } else {
        retryConnectionId = setTimeout(tryConnection, onlineRetryInterval);
        onTimeout(new ErrorTracker('waiting to go online', errorCodes.Error620));
      }
    }());
  });
}
