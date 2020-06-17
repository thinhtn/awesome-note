import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAieIXDXe0uOf3HiqMTCtJSqST1QeaEtqY",
  authDomain: "react-notes-app-5bd01.firebaseapp.com",
  databaseURL: "https://react-notes-app-5bd01.firebaseio.com",
  projectId: "react-notes-app-5bd01",
  storageBucket: "react-notes-app-5bd01.appspot.com",
  messagingSenderId: "534554566192",
  appId: "1:534554566192:web:540cf3dc4b37f8e21397f5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
