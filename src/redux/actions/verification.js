import axios from "axios";

// --- Простые экшены (без логики) ---
export const setUserDetails = ({ name, email, phoneNumber, address }) => ({
  type: "SET_USER_DETAILS",
  payload: { name, email, phoneNumber, address },
});

export const userExit = () => ({
  type: "USER_EXIT",
});

export const setCodeSent = (status) => ({
  type: "SET_CODE_SENT",
  payload: status,
});

export const setVerificationCode = (code) => ({
  type: "SET_VERIFICATION_CODE",
  payload: code,
});

export const setVerificationConfirm = (status) => ({
  type: "SET_VERIFICATION_CONFIRM",
  payload: status,
});

export const setUserExistence = (exists) => ({
  type: "SET_USER_EXISTENCE",
  payload: exists,
});

// --- Вспомогательная функция для базового URL (только здесь, без отдельного файла) ---
const getBaseUrl = () => "http://localhost:3001";

// --- Thunk: сохранение данных пользователя ---
export const saveUserDetails = (userDetails) => async (dispatch) => {
  dispatch(setUserDetails(userDetails));
  dispatch({ type: "SET_USER_DETAILS_LOADING" });

  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      throw new Error("Ошибка при сохранении данных на сервере");
    }

    const data = await response.json();

    dispatch({
      type: "SET_USER_DETAILS_SUCCESS",
      payload: data,
    });
  } catch (error) {
    console.error("saveUserDetails error:", error);
    dispatch({
      type: "SET_USER_DETAILS_FAILURE",
      payload: error.message,
    });
  }
};

// --- Thunk: отправка кода подтверждения ---
export const sendVerificationCode = (email) => async (dispatch) => {
  const baseUrl = getBaseUrl();

  try {
    const response = await axios.post(
      `${baseUrl}/api/verification/send-email`,
      { email },
    );

    // Лучше не использовать alert — кидаем статус в стор, интерфейс сам покажет сообщение
    if (response.status === 200) {
      dispatch(setCodeSent(true));
    } else {
      dispatch(setCodeSent(false));
      throw new Error("Сервер вернул неожиданный статус при отправке кода");
    }
  } catch (error) {
    console.error("sendVerificationCode error:", error);
    dispatch(setCodeSent(false));
  }
};

// --- Thunk: проверка кода ---
export const verifyCode = (email, code) => async (dispatch) => {
  const baseUrl = getBaseUrl();

  try {
    const response = await axios.post(
      `${baseUrl}/api/verification/verify-code`,
      {
        email,
        code,
      },
    );

    if (response.status === 200) {
      dispatch(setVerificationConfirm(true));
    } else {
      dispatch(setVerificationConfirm(false));
      throw new Error("Код не подтверждён или сервер вернул ошибку");
    }
  } catch (error) {
    console.error("verifyCode error:", error);
    dispatch(setVerificationConfirm(false));
  }
};

// --- Thunk: получение данных пользователя по email ---
export const fetchUserData = (email) => async (dispatch) => {
  const baseUrl = getBaseUrl();

  try {
    const response = await axios.get(`${baseUrl}/api/users`, {
      params: { email },
    });

    if (response.status === 200 && response.data) {
      const { name, phone_number: phoneNumber, address } = response.data;
      dispatch(setUserDetails({ name, email, phoneNumber, address }));
      dispatch(setUserExistence(true));
    } else {
      dispatch(setUserExistence(false));
      throw new Error("Пользователь не найден или ошибка сервера");
    }
  } catch (error) {
    console.error("fetchUserData error:", error);
    dispatch(setUserExistence(false));
  }
};
