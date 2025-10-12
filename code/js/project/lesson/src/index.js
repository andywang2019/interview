
import {Provider} from 'react-redux'

import App from './containers/App'
import store from './redux/store'
/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

*/
import React from 'react'
//import ReactDOM from 'react-dom'
import ReactDOM from "react-dom/client";



const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
    <Provider store={store}>
            <App  />
    </Provider>
);

// 渲染 App
/*
root.render(
    <React.StrictMode>
        <App store={store} />
    </React.StrictMode>
);

// 给store绑定状态更新的监听
//store.subscribe(() => { // store内部的状态数据发生改变时回调
                        // 重新渲染App组件标签
//    root.render(
      //  <React.StrictMode>
//            <App store={store}/>
     //   </React.StrictMode>
//    );
//})
*/







