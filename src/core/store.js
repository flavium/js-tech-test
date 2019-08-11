import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
import reduxThunk from 'redux-thunk';

let store;
/**
 * Inits redux, stores.
 */
let reducers = {
  dummy: (state = {}) => {
    return state;
  },
};

/**
 * Gets initial reducers and creates the store
 * @param {Object} reducerList holds all reducers for init
 * @returns {*} Newly created store
 */
export function init(reducerList, middlewares = []) {
  reducers = Object.assign({}, reducers, reducerList);
  store = createNewStore(reducers, middlewares);
  return store;

}

// === Private functions ===

function createNewStore(reducers, middlewares) {
  return createStore(
    combineReducers(reducers),
    compose(
      applyMiddleware(...[reduxThunk, ...middlewares]),
      // Use chrome devtool extension instead of bundling into app
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ),
  );

}

export function getStore() {
  return store;
}
