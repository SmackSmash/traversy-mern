import types from '../actions/types';

const INITIAL_STATE = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.USER_LOADED:
      return { ...state, isAuthenticated: true, loading: false, user: action.payload };
    case types.REGISTER_SUCCESS:
      return { ...state, token: action.payload, isAuthenticated: true, loading: false };
    case types.REGISTER_FAIL:
    case types.AUTH_ERROR:
      return { ...state, token: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};
