import ErrorTracker from './core/error';
import appInit from './core/app-init';
import appReducer from "./store/reducers/appReducers";
import eventsReducer from "./store/reducers/eventsReducers";

appInit({
  reconnectInterval: 5000,
  onlineRetryInterval: 10000,
  url: 'ws://localhost:8889',
  reducerList: { app: appReducer, events: eventsReducer },
  onError: setErrorPageContent,
}).then((initData) => {
  try {
    const init = require('./main').default; // eslint-disable-line global-require
    init(initData);
  } catch (err) {
    setErrorPageContent([new ErrorTracker(err)]);
  }
});

function setErrorPageContent(errorList = []) {
  const ReactDOM = require('react-dom');
  const React = require('react');
  const ErrorPage = require('./containers/ErrorPage').default;

  ReactDOM.render(
    <ErrorPage errorList={errorList} />,
    document.getElementById('root'),
  );
}
