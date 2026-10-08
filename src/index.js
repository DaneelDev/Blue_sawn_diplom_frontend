import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Router} from 'react-router-dom';

import { Provider } from 'react-redux';

import './scss/app.scss';

import store from './redux/store';

import App from './App';


store.dispatch({
  type: 'SET_SORT_BY',
  payload: 'price'
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <App/>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

