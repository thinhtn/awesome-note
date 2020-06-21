import firebase from 'firebase/app';
import 'firebase/storage';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyAieIXDXe0uOf3HiqMTCtJSqST1QeaEtqY',
  authDomain: 'react-notes-app-5bd01.firebaseapp.com',
  databaseURL: 'https://react-notes-app-5bd01.firebaseio.com',
  projectId: 'react-notes-app-5bd01',
  storageBucket: 'react-notes-app-5bd01.appspot.com',
  messagingSenderId: '534554566192',
  appId: '1:534554566192:web:540cf3dc4b37f8e21397f5',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

console.log('Initialize Firebase DB');

export { storage, firebase as default };
