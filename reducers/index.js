import { combineReducers } from 'redux';

import appConfig from 'reducers/AppConfig';
import users from 'reducers/Users';
import feeds from 'reducers/Feeds';

const appReducers = combineReducers({
  appConfig,
  users,
  feeds,
});

export default appReducers;
