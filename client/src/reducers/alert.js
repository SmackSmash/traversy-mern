import types from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_ALERT:
      return [...state, action.payload];
    case types.REMOVE_ALERT:
      return state.filter(alert => alert.id !== action.payload);
    default:
      return state;
  }
};
