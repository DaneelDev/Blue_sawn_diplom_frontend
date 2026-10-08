import { createStore, compose, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; 
import Cookies from 'js-cookie';

import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Восстановление состояния из куки
let persistedState = {};
const cookieState = Cookies.get('reduxState');
if (cookieState) {
  try {
    persistedState = JSON.parse(cookieState);
  } catch (e) {
    console.warn('Не удалось распарсить состояние из куки', e);
  }
}

// Создаем хранилище с восстановленным состоянием
const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);

// Подписываемся на изменения состояния и сохраняем в куки
store.subscribe(() => {
  const state = store.getState();
  try {
    Cookies.set('reduxState', JSON.stringify(state), { expires: 7 }); // срок хранения 7 дней
  } catch (e) {
    console.warn('Не удалось сохранить состояние в куки', e);
  }
});

export default store;
