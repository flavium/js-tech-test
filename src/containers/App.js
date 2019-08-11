import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { getConnected } from '../store/reducers/appReducers';
import { appConst } from '../store/actions/appActions'
import '../css/App.css';
import { CircularProgress } from '@material-ui/core';
import {
  eventsConst,
  changeOdsDisplay,
} from '../store/actions/eventsActions';
import Header from './Header';
import EventsContainer from './EventsContainer'
import EventDetails from './EventDetails';

library.add(fas, faChevronDown, faChevronUp);

function App(props) {

  return (
    <div className='App'>
      {
        !props.connected
        ? <CircularProgress className='CircularProgress' variant='indeterminate' thickness={3} size={50} />
        : <Router history={createBrowserHistory()}>
            <div className='MainContainer'>
              <Header eventType='Football live' odsDisplay={props.oddsDisplay} changeOdsDisplay={props.changeOdsDisplay} />
              <Switch>
                <Route exact path='/event/:id' component={EventDetails} />
                <Route exact path='/' component={EventsContainer} />
              </Switch>
            </div>
          </Router>
      }
    </div>
  );
}

const mapStateToProps = state => ({
  connected: getConnected(state[appConst.STORE_ID]),
  oddsDisplay: state[eventsConst.STORE_ID].oddsDisplay,
});

const mapDispatchToProps = dispatch => ({
  changeOdsDisplay: (event) => dispatch(new changeOdsDisplay(event.target.value)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
