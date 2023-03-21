import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
require('dotenv').config();

// const firebaseSettings = {
//   apiKey: "AIzaSyDRPLaliALgWsCta6uL5e9pXpQl5P2njA8",
//   authDomain: "activity-tracker-9df33.firebaseapp.com",
//   projectId: "activity-tracker-9df33",
//   storageBucket: "activity-tracker-9df33.appspot.com",
//   messagingSenderId: "312372235098",
//   appId: "1:312372235098:web:31c75240b6a72bb2764163",
//   measurementId: "G-XB8ME6R36V",
// };

const firebaseSettings = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app = firebase.initializeApp(firebaseSettings)

const firestore = app.firestore();

export const database = {
  exercises: firestore.collection("exercises"),
  workouts: firestore.collection("workouts"),
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};

export const auth = app.auth();

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default app;
