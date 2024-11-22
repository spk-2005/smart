import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXDIt7TAima9r5xXhGJUofc-2INJgBkx8",
  authDomain: "swasthik-2ad53.firebaseapp.com",
  projectId: "swasthik-2ad53",
  storageBucket: "swasthik-2ad53.appspot.com",
  messagingSenderId: "472342143698",
  appId: "1:472342143698:web:799d54184e15545789030b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth();

// Initialize Google and Facebook providers
const provide = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Initialize Storage
const storage = getStorage(app);

// Exporting to be used in other parts of your application
export { auth, provide, facebookProvider, storage };
