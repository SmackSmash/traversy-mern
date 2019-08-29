import uuid from 'uuid/v4';
import types from './types';

export const setAlert = (message, alertType) => dispatch => {
  dispatch({
    type: types.SET_ALERT,
    payload: {
      id: uuid(),
      message,
      alertType
    }
  });
};
