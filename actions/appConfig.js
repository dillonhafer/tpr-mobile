import { UPDATE_DOMAIN } from 'redux-constants/action-types';

export const updateDomain = domain => {
  return {
    type: UPDATE_DOMAIN,
    domain,
  };
};
