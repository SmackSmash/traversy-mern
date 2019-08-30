import axios from 'axios';
import types from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    try {
      const response = await axios.get('/api/auth');
      dispatch({
        type: types.USER_LOADED,
        payload: response.data
      });
    } catch (error) {
      error.response.data.errors.forEach(message => {
        console.error(`Error: ${message}`);
        setAlert(message, 'danger')(dispatch);
      });
      delete localStorage.token;
      dispatch({
        type: types.AUTH_ERROR
      });
    }
  }
};

// Register user
export const register = signUpData => async dispatch => {
  try {
    const response = await axios.post('/api/users', signUpData);
    const { token } = response.data;
    localStorage.token = token;
    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: token
    });
  } catch (error) {
    error.response.data.errors.forEach(message => {
      console.error(`Error: ${message}`);
      setAlert(message, 'danger')(dispatch);
    });
    delete localStorage.token;
    dispatch({
      type: types.REGISTER_FAIL
    });
  }
};
