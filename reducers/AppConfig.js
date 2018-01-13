import { UPDATE_DOMAIN } from 'redux-constants/action-types';

const initialState = {
  domain: '',
};

export default function appConfig(state = initialState, action) {
  switch (action.type) {
    case UPDATE_DOMAIN:
      return {
        ...state,
        domain: action.domain,
      };
    default:
      return state;
  }
}
