import { React, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../Firebase/Firebase"; // Import your Firebase app configuration
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import Uploadpicture from "../Firebase/Uploadpicture";


const Signup = () => {
  //Instance initiation
  const navigate = useNavigate();
  const firebaseContext = useFirebase();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("")
  const [pfp, setPfp] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const imageRef = useRef(null);
  const cropperRef = useRef(null);

  const handleGoogleSignIn = () => { };
  const handleFacebookSignIn = () => { };
  const handleTwitterSignIn = () => { };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const imgURL = await Uploadpicture(croppedImage)
    try {
      await firebaseContext.signupUserWithEmailandPassword(
        email,
        password,
        firstName,
        lastName,
        username,
        gender,
        dob,
        imgURL
      );
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setDob('');
      setGender('');
      setUsername('');
      setCroppedImage(null)
      setPfp(null)
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }
    finally {
      setLoading(false)
    }
  };

  const handleFileChange = (e) => {
    debugger
    const file = e.target.files[0];
    if (file) {
      setPfp(URL.createObjectURL(file));
      setIsModalOpen(true); // Open the cropper modal
    }
  };

  // Initialize Cropper.js once the image is loaded
  const initializeCropper = () => {
    if (imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: 1, // Enforce square crop for circular shape
        viewMode: 2, // Allow image to be bigger than the crop box
        dragMode: "move", // Allow image dragging
        autoCropArea: 1, // Default crop area size
        cropBoxResizable: false, // Don't allow resizing of crop box
        cropBoxMovable: true, // Allow moving the crop box
        zoomable: true, // Allow zooming
        scalable: true, // Allow scaling
        ready() {
          // Adjust cropper to have a circular frame
          const cropBox = document.querySelector(".cropper-crop-box");
          cropBox.style.borderRadius = "50%"; // Circular crop area
        },
      });
    }
  };

  // Crop the image and create a circular preview
  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas({
        width: 200, // Desired width of the cropped image
        height: 200, // Desired height of the cropped image
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      // Create a circular image from the cropped square
      const outputCanvas = document.createElement("canvas");
      const context = outputCanvas.getContext("2d");

      outputCanvas.width = 200;
      outputCanvas.height = 200;
      context.beginPath();
      context.arc(100, 100, 100, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      context.drawImage(canvas, 0, 0, 200, 200);

      // setCroppedImage(outputCanvas.toDataURL("image/png"));

      outputCanvas.toBlob((blob) => {
        const file = new File([blob], 'cropped-image.png', { type: 'image/png' })
        setCroppedImage(file)
      })
      setPfp(outputCanvas.toDataURL("image/png"))
      setIsModalOpen(false); // Close the cropper modal after cropping
    }
  };

  // Close the modal without saving the cropped image
  const closeModal = () => {
    setIsModalOpen(false);
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
              htmlFor="pfp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Photo
            </label>
            <input
              type="file"
              id="pfp"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Cropping Modal */}
            {isModalOpen && (
              <div
                className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20"
                onClick={closeModal}
              >
                <div
                  className="bg-white p-4 rounded-lg max-w-lg w-full relative"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                  <div className="relative">
                    <img
                      ref={imageRef}
                      src={pfp}
                      alt="To Crop"
                      onLoad={initializeCropper}
                      className="max-w-full"
                    />
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCrop}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Crop
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
          {/* Cropped Image Preview */}
          {croppedImage && (
            <div className="mb-4 "> {/* Flexbox to align items to the right */}
              <div className="block text-sm font-medium text-gray-700 mb-2"> {/* Preview text with reduced right margin */}
                <p>Preview:</p>
              </div>

              <div className="w-24 h-24 rounded-full overflow-hidden border">
                <img
                  src={URL.createObjectURL(croppedImage)}
                  alt="Cropped"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}


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
              id="username"
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
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex justify-center items-center relative"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              'Sign Up'
            )}
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
      </div >
    </div >
  );
};

export default Signup;
