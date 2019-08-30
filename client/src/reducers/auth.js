import types from '../actions/types';

const INITIAL_STATE = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.REGISTER_SUCCESS:
      return { ...state, token: action.payload, isAuthenticated: true, loading: false };
    case types.REGISTER_FAIL:
      return { ...state, token: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};
