import axios from 'axios';
import types from './types';
import { setAlert } from './alert';

// Register user
export const register = signUpData => async dispatch => {
  try {
    const response = await axios.post('/api/users', signUpData);
    const { token } = response.data;
    localStorage.setItem('token', token);
    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: token
    });
  } catch (error) {
    error.response.data.errors.forEach(message => {
      console.error(`Error: ${message}`);
      setAlert(message, 'danger')(dispatch);
    });
    localStorage.removeItem('token');
    dispatch({
      type: types.REGISTER_FAIL
    });
  }
};
