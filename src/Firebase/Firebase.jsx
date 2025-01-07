import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

const FirebaseContext = createContext(null);

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSANGER_ID,
  appId: process.env.REACT_APP_APP_ID
};

export const useFirebase = () => useContext(FirebaseContext); // This is now inside a function
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp)

export const FirebaseProvider = (props) => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const signupUserWithEmailandPassword = async (
    email,
    password,
    firstName,
    lastName,
    username,
    gender,
    dob,
    imgURL,
    uid
  ) => {

    try {
      setIsSigningUp(true);
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await setDoc(doc(dbFirestore, "users", uid = res.user.uid), {
        email,
        password,
        firstName,
        lastName,
        username,
        gender,
        dob,
        imgURL,
        uid,
        blocked: [],
      });
      await setDoc(doc(dbFirestore, "userChats", uid), {
        chats: [],
      });
      await signOut(firebaseAuth);
      // Optionally clear local states
      setCurrentUser(null);
      // Navigate to the home page after successful signup
      navigate("/");
      window.location.reload()
    } catch (err) {
      console.log("Error signing up user:", err)
    } finally {
      setIsSigningUp(false)
    }
  };


  // User Login Error handeling

  const [error, setError] = useState(null)
  const loginUserWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    }
    catch (err) {
      console.log(err.code)
      setError(err.code)
    }
  };


  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserInfo = async (uid) => {
    try {
      const docRef = doc(dbFirestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentUser(docSnap.data());
        setLoading(false);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const isLoggedIn = currentUser ? true : false;

  const isSignupPage = location.pathname === "/Signup";
  useEffect(() => {
    if (isSigningUp) return

    if (currentUser) {
      navigate("/Loggedinwindow");
    }
    else if (!currentUser && !isSignupPage) {
      navigate("/")
    }
  }, [currentUser, isLoggedIn, navigate, isSignupPage]);

  const Logout = () => {
    setCurrentUser(null)
    signOut(firebaseAuth)
    window.location.reload()
  }

  const uploadProfilePicture = () => {

  }
  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailandPassword,
        loginUserWithEmailAndPassword,
        uploadProfilePicture,
        fetchUserInfo,
        isLoggedIn,
        currentUser,
        loading,
        Logout,
        error
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

// Initialize Firestore
export const dbFirestore = getFirestore(firebaseApp);
