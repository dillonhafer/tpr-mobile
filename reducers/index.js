import { combineReducers } from 'redux';

import appConfig from 'reducers/AppConfig';
import users from 'reducers/Users';

const appReducers = combineReducers({
  appConfig,
  users,
});

export default appReducers;
