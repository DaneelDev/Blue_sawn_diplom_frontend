import axios from "axios";

export const setLoaded = (payload) => ({
  type: "SET_LOADED",
  payload,
});

export const setProducts = (items) => ({
  type: "SET_PRODUCTS",
  payload: items,
});

// Добавляем экшен для ошибок — чтобы интерфейс мог показать сообщение
export const setError = (error) => ({
  type: "SET_ERROR",
  payload: error,
});

export const fetchProducts = (sortBy, category) => (dispatch) => {
  dispatch(setLoaded(false));
  dispatch(setError("")); // сбрасываем старую ошибку

  // Берём адрес из переменной окружения (для CRA обязательно REACT_APP_)
  // Если её нет (локально) — будет localhost
  const baseUrl = "http://localhost:3001";

  // Собираем параметры через URLSearchParams — это надёжнее, чем вручную клеить строку
  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }
  params.append("_sort", sortBy);
  params.append("_order", "desc");

  axios
    .get(`${baseUrl}/api/products`, { params })
    .then((response) => {
      dispatch(setProducts(response.data));
    })
    .catch((error) => {
      console.error("fetchProducts error:", error);
      dispatch(setError("Не удалось загрузить товары. Попробуйте позже."));
    })
    .finally(() => {
      // Если хочешь, здесь можно вызвать dispatch(setLoaded(true));
    });
};
