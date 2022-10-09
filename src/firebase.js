import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBKfNQNlKFNhjQ_bB85RAZw9nEY-I-vcvo",
    authDomain: "datashare-f8f6d.firebaseapp.com",
    databaseURL: "https://datashare-f8f6d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "datashare-f8f6d",
    storageBucket: "datashare-f8f6d.appspot.com",
    messagingSenderId: "244000169655",
    appId: "1:244000169655:web:ea6d2aca4f3585439cf732"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)


export {db}