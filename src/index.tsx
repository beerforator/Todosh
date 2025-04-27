import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import reportWebVitals from './reportWebVitals';
import AppWithRedux from './AppWithRedux';
import { store } from './state/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Раньше AppWithRedux был обернут в <React.StrictMode>

root.render(
  <Provider store={store}>
    <AppWithRedux />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
