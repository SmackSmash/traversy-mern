import uuid from 'uuid/v4';
import types from './types';

export const setAlert = (message, alertType, timeout = 5000) => dispatch => {
  const id = uuid();
  dispatch({
    type: types.SET_ALERT,
    payload: {
      id,
      message,
      alertType
    }
  });
  setTimeout(() => {
    dispatch({
      type: types.REMOVE_ALERT,
      payload: id
    });
  }, timeout);
};
