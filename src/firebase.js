import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/functions';
import 'firebase/compat/storage';
import 'firebase/compat/analytics';

// firebase init
let firebaseConfig = {
    apiKey: "AIzaSyApnZly0Ilfc4RwQ7SRasP_vrWIjDeGquw",
    authDomain: "authentication-f0d7e.firebaseapp.com",
    databaseURL: "https://authentication-f0d7e-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "authentication-f0d7e",
    storageBucket: "authentication-f0d7e.appspot.com",
    messagingSenderId: "501106833695",
    appId: "1:501106833695:web:84eaa91063403841c0582a",
    measurementId: "G-P207K4XM6Y"
};

/*console.log("location=", location);
 if(location.hostname === 'localhost'){
 firebaseConfig = {
 databaseURL: 'http://localhost:8080?ns=authentication-f0d7e',
 projectId: "authentication-f0d7e",
 apiKey: "AIzaSyApnZly0Ilfc4RwQ7SRasP_vrWIjDeGquw",
 storageBucket: "authentication-f0d7e.appspot.com"
 }
 }*/
firebase.initializeApp(firebaseConfig);
// console.log("firebase=", firebase);

const db = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.functions();
const analytics = firebase.analytics();
const database = firebase.database();
const alarmsRef = database.ref('alarms');

if (location.hostname === "localhost") {
    //db.useEmulator("localhost", 8080);
}

let storage = firebase.storage();

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const {TimeStamp, GeoPoint} = firebase.firestore
export { TimeStamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
//auth.useEmulator("http://localhost:9099");

// collection references
const usersCollection = db.collection('newUsers');

export {
        db,
        alarmsRef,
        database,
        auth,
        functions,
        storage,
        usersCollection,
        analytics
        }
