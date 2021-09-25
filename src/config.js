// Import the functions you need from the SDKs you need
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA_I3ekiXJdDX4pNo95RMP2Lmo4NpdsmcU",
    authDomain: "cognipeak.firebaseapp.com",
    databaseURL: "https://cognipeak-default-rtdb.firebaseio.com",
    projectId: "cognipeak",
    storageBucket: "cognipeak.appspot.com",
    messagingSenderId: "1069723601254",
    appId: "1:1069723601254:web:968a45f81edde7360c20a7",
    measurementId: "G-6SZT66VFFH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;