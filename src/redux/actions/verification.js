import axios from 'axios';

// Действия
export const setUserDetails = ({ name, email, phoneNumber, address }) => ({
  type: 'SET_USER_DETAILS',
  payload: { name, email, phoneNumber, address },
});

export const saveUserDetails = (userDetails) => {
  return async (dispatch) => {
    dispatch(setUserDetails(userDetails)); // сохраняем в store

    dispatch({ type: 'SET_USER_DETAILS_LOADING' }); // Устанавливаем состояние загрузки

    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении данных на сервере');
      }

      const data = await response.json();

      dispatch({
        type: 'SET_USER_DETAILS_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'SET_USER_DETAILS_FAILURE',
        payload: error.message,
      });
    }
  };
};


export const userExit = () =>({
    type: "USER_EXIT",
})

export const setCodeSent = (status) => ({
  type: 'SET_CODE_SENT',
  payload: status,
});

export const setVerificationCode = (code) => ({
  type: 'SET_VERIFICATION_CODE',
  payload: code,
});

export const setVerificationConfirm = (status) => ({
  type: 'SET_VERIFICATION_CONFIRM',
  payload: status,
});

// Новый action для установки существования пользователя
export const setUserExistence = (exists) => ({
  type: 'SET_USER_EXISTENCE',
  payload: exists,
});

// Thunk для отправки кода
export const sendVerificationCode = (email) => async (dispatch) => {
  try {
    const response = await axios.post('/send-email', { email });

    if (response.status === 200) {
      dispatch(setCodeSent(true));
    } else {
      alert('Ошибка при отправке кода');
    }
  } catch (error) {
    alert('Ошибка при отправке кода');
    console.error(error);
  }
};

// Thunk для проверки кода и существования пользователя
export const verifyCode = (email, code) => async (dispatch) => {
  try {
    const response = await axios.post('/verify-code', { email, code });

    if (response.status === 200) {
      dispatch(setVerificationConfirm(true));
    } else {
      dispatch(setVerificationConfirm(false));
    }
  } catch (error) {
    alert('Ошибка при проверке кода: ' + error.message);
    console.error('Ошибка:', error);
  }
};

// Thunk для получения данных пользователя по e-mail с обновлением isUserExist
export const fetchUserData = (email) => async (dispatch) => {
  try {
    const response = await axios.get(`/users`, {
      params: { email }
    });

    if (response.status === 200 && response.data) {
      const { name, phone_number: phoneNumber, address } = response.data;
      dispatch(setUserDetails({ name, email, phoneNumber, address }));
      dispatch(setUserExistence(true));
    } else {
      dispatch(setUserExistence(false));
      throw new Error('Не удалось получить данные пользователя');
    }
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    
    dispatch(setUserExistence(false));
  }
};
