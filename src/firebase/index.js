import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhipJ4SX96CbnuyUPeMcpYfbAnC_E260E",
  authDomain: "photo-review-ad943.firebaseapp.com",
  projectId: "photo-review-ad943",
  storageBucket: "photo-review-ad943.appspot.com",
  messagingSenderId: "639852590090",
  appId: "1:639852590090:web:e26cf953a4b60cd6b5dbf3",
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Gets Firebase Firestore instance
const db = getFirestore(app);
// Gets Firebase Storage instance
const storage = getStorage(app);
// Gets Firebase Authentication instance
const auth = getAuth();

export { app as default, db, storage, auth };
