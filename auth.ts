// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import {
  activate,
  fetchAndActivate,
  fetchConfig,
  getRemoteConfig,
  getValue,
} from "firebase/remote-config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//console.log(process.env.apiKey)
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCRTufqYpj4_3HdEYqzU4EQ3zTu-oQmTyw",
//   authDomain: "react-flow-f9455.firebaseapp.com",
//   projectId: "react-flow-f9455",
//   storageBucket: "react-flow-f9455.appspot.com",
//   messagingSenderId: "715694870988",
//   appId: "1:715694870988:web:a79f88f5ecfd27b9004d69",
//   measurementId: "G-JG4RFPR5TB"
// };
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};
let app = initializeApp(firebaseConfig);
// if (!firebase.getApps().length) {
//   app = firebase.initializeApp(firebaseConfig);
// } else {
//   app = firebase.getApp();
// }

// Initialize Firebase
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
// const analytic = getAnalytics(app);
// console.log(analytic)
export const auth = getAuth(app);
let remoteConfig: any;
if (typeof window !== "undefined") {
  remoteConfig = getRemoteConfig();
  remoteConfig.settings.minimumFetchIntervalMillis = 1000;
}

export { remoteConfig, activate, fetchAndActivate, fetchConfig, getValue };
