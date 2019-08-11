export const WEBSOCKET_BEGIN_RECONNECT = 'BEGIN_RECONNECT';
export const WEBSOCKET_RECONNECT_ATTEMPT = 'RECONNECT_ATTEMPT';
export const WEBSOCKET_RECONNECTED = 'RECONNECTED';
export const WEBSOCKET_BROKEN = 'BROKEN';
export const WEBSOCKET_CLOSED = 'CLOSED';
export const WEBSOCKET_ERROR = 'ERROR';
export const WEBSOCKET_MESSAGE = 'MESSAGE';
export const WEBSOCKET_OPEN = 'OPEN';
export const WEBSOCKET_CONNECT = 'CONNECT';
export const WEBSOCKET_DISCONNECT = 'DISCONNECT';
export const WEBSOCKET_SEND = 'SEND';
export const appConst = {
  STORE_ID: 'app',
};

function buildAction(actionType, payload, meta) {
  const base = {
    type: actionType,
    meta: {
      timestamp: new Date(),
      ...meta,
    },
    ...(payload instanceof Error ? { error: true } : null),
  };

return payload ? { ...base, payload } : base;
}
export const connect = (url) => buildAction(WEBSOCKET_CONNECT, { url });
export const disconnect = () => buildAction(WEBSOCKET_DISCONNECT);
export const send = (payload) => buildAction(WEBSOCKET_SEND, payload);
export const beginReconnect = () => buildAction(WEBSOCKET_BEGIN_RECONNECT);
export const reconnectAttempt = (count) => buildAction(WEBSOCKET_RECONNECT_ATTEMPT, { count });
export const reconnected = () => buildAction(WEBSOCKET_RECONNECTED);
export const open = (event) => buildAction(WEBSOCKET_OPEN, event);
export const broken = () => buildAction(WEBSOCKET_BROKEN);
export const closed = (event) => buildAction(WEBSOCKET_CLOSED, event);
export const message = (event) => (
  buildAction(JSON.parse(event.data).type, {
    event,
    data: JSON.parse(event.data).data,
    origin: event.origin,
  })
);
export const error = (originalAction = null, err) => (
  buildAction(WEBSOCKET_ERROR, err, {
    message: err.message,
    name: err.name,
    originalAction,
  })
);
