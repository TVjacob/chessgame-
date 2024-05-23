export const loginUser = (dispatch, loginPayload) => {
  
  dispatch({ type: 'REQUEST_LOGIN' });
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginPayload)
  };
  return new Promise((resolve, reject) => {
    try {
      fetch('/api/login', requestOptions)
        .then(res => res.json())
        .then(data => {
          if (data.username) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: data });
            localStorage.setItem('currentUser', JSON.stringify(data));
            resolve(data);
          }
          dispatch({ type: 'LOGIN_ERROR', error: data.message });
          resolve(data);
        })
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', error: err });
      reject(err);
    }
  });
};

export const logout = (dispatch) => {
  dispatch({ type: 'LOGOUT' });
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
}

export const register = (dispatch, regisPayload) => {
  dispatch({type: 'REQUEST_LOGIN'});
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regisPayload)
  };
  return new Promise((resolve, reject) => {
    try {
      fetch('/api/register', requestOptions)
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('currentUser', JSON.stringify(data));
            dispatch({ type: 'REGISTER_SUCCESS', payload: data });
            resolve(data);
          }
          dispatch({ type: 'LOGIN_ERROR', error: data.message });
          resolve(data);
        })
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', error: err });
      reject(err);
    }
  });
};