import { UPDATE_CURRENT_USER } from 'redux-constants/action-types';

const initialState = {
  currentUser: {
    name: '',
    email: '',
  },
  name: '',
};

export default function sessionState(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.user,
      };
    default:
      return state;
  }
}
