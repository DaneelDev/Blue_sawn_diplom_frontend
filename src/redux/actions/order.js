import axios from "axios";

// Базовый URL берём из переменной окружения.
// Если её нет (локально) — используем localhost.
// Для CRA обязательно приставка REACT_APP_
const API_URL = "http://localhost:3001";

export const sendOrder = (orderData) => async (dispatch) => {
  try {
    // Теперь путь относительный, а базовый URL вынесен отдельно
    const response = await axios.post(`${API_URL}/api/orders`, orderData);
    dispatch({ type: "ORDER_SENT", payload: response.data });
  } catch (error) {
    console.error("Error sending order:", error);
    dispatch({ type: "ORDER_ERROR", payload: error });
  }
};
