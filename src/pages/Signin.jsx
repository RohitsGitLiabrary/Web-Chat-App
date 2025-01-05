import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useFirebase, firebaseAuth, error } from "../Firebase/Firebase";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
  const firebaseContext = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!email) {
      setErrorMsg("Email is required!");
      setLoading(false);
      return;
    }
    if (!password) {
      setErrorMsg("Password is required!");
      setLoading(false);
      return;
    }
    try {
      firebaseContext.loginUserWithEmailAndPassword(email, password);
    } catch {
      setErrorMsg("Unexpected error ocurred, please try again after some time.")
    }
  };

  useEffect(() => {
    if (!email && !password) return
    switch (firebaseContext.error) {
      case "auth/invalid-credential":
        setErrorMsg("Invalid Username or Password");
        setLoading(false);
        break;
      case "auth/invalid-email":
        setErrorMsg("Invalid Email ID");
        setLoading(false);
        break;
      case "auth/user-not-found":
        setErrorMsg("No user found with this email.");
        setLoading(false);
        break;
      case "auth/wrong-password":
        setErrorMsg("The password is incorrect.");
        setLoading(false);
        break;
      case "auth/internal-error	":
        setErrorMsg("The authentication server encountered an unexpected error. Please try again after some time.");
        setLoading(false);
        break;
      default:
        setErrorMsg("An error occurred. Please try again.");
        setLoading(false);
        break;
    }
  }, [firebaseContext.error])


  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      try {
        firebaseContext.fetchUserInfo(user.uid);
      } catch (err) {
        console.log(err.message);
      }
    });
  }, [firebaseContext.fetchUserInfo, firebaseContext]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* App Name */}
      <h1 className="text-4xl font-bold text-blue-500 mb-6">WebChat</h1>

      {/* Auth Container */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {/* Sign In Form */}

        <form onSubmit={handleSignIn}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome Back!
          </h2>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm text-center mb-4">
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex justify-center items-center relative"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/Signup");
              }}
            >
              Sign Up here
            </button>
          </p>
        </form>
      </div>
    </div >
  );
};

export default Signin;
