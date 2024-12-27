import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../Firebase/Firebase"; // Import your Firebase app configuration
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import { toast } from "react-toastify";

const Signup = () => {
  //Instance initiation
  const navigate = useNavigate();
  const firebaseContext = useFirebase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("")

  const handleGoogleSignIn = () => { };
  const handleFacebookSignIn = () => { };
  const handleTwitterSignIn = () => { };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebaseContext.signupUserWithEmailandPassword(
        email,
        password,
        firstName,
        lastName,
        username,
        gender,
        dob
      );
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }
    toast.success("Sign up sccessfully");
    console.log("Sign up Successfully");
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* App Name */}
      <h1 className="text-4xl font-bold text-blue-500 mb-6">WebChat</h1>

      {/* Auth Container */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {/* Sign Up Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create Your Account
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your first name"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="gender"
            >
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Username
            </label>
            <input
              type="text"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            // onClick={signupUserWithEmailandPasswor}
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>

          {/* Horizontal line after Sign Up button */}
          <hr className="my-6" />
          <p className="text-center text-gray-600 font-medium mb-4">
            Sign Up with
          </p>

          <div className="flex justify-around mt-6 space-xs-9">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300"
            >
              <FaGoogle className="text-white" size={24} />
            </button>
            <button
              type="button"
              onClick={handleFacebookSignIn}
              className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition duration-300"
            >
              <FaFacebook className="text-white" size={24} />
            </button>
            <button
              type="button"
              onClick={handleTwitterSignIn}
              className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition duration-300"
            >
              <FaTwitter className="text-white" size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center mt-9">
            Already have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Sign In here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
