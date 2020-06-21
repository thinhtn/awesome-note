import firebase from 'firebase/app';
import 'firebase/storage';
require('dotenv').config();

console.log('API_KEY :>> ', process.env.API_KEY);
console.log('APP_ID :>> ', process.env.APP_ID);
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

console.log('Initialize Firebase DB');

export { storage, firebase as default };
