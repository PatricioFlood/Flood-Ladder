import firebase from "firebase/app"
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDHJeB2Mb_wHXp0Z9zCqw6pLBCzIhc1djY",
    authDomain: "flood-ladder.firebaseapp.com",
    projectId: "flood-ladder",
    storageBucket: "flood-ladder.appspot.com",
    messagingSenderId: "616232943530",
    appId: "1:616232943530:web:b3fabf842c21434558b5d3",
    measurementId: "G-NY7JHLTET0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Utils 
const auth = firebase.auth();

//Exports
export { auth }