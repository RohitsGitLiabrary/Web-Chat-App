import { React } from "react";
import { dbFirestore, useFirebase } from "../Firebase/Firebase";
import { useChatcontext } from "../context/Chatcontext";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const UserDetail = () => {
  const { currentUser } = useFirebase()
  const firebaseContext = useFirebase();
  const { changeBlock, user, isReceiverBlocked, isCurrentUserBlocked } = useChatcontext()


  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await firebaseContext.Logout()
      console.log("Log out success")
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleBlockUser = async () => {
    if (!user) return
    const usersRef = doc(dbFirestore, "users", currentUser.uid);

    try {
      await updateDoc(usersRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      })
      changeBlock();
    }
    catch (err) {
      console.log(err)
    }

  }


  return (<div className="lg:flex lg:w-1/4 h-screen bg-white border-l flex-col">
    {/* User Info */}
    <div className="p-4 bg-gray-100 border-b sticky top-0 z-10">
      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"></div>
      <h3 className="text-lg mt-4 text-center font-medium text-gray-800">
        {isCurrentUserBlocked ? "Webchat User" :
          isReceiverBlocked ? "Webchat User" : user?.firstName + " " + user?.lastName}
      </h3>
      <p className="text-center text-sm text-gray-600">{isReceiverBlocked ? "" : "Active Now"}</p>
    </div>

    {/* Additional Info */}
    <div className="flex-1 p-4 overflow-y-auto">
      <h4 className="text-lg font-medium text-gray-800 mb-2">Details</h4>
      <p className="text-sm text-gray-600 mb-4">
        Email: {isReceiverBlocked ? "webchatuser@email.com" : user?.email}
      </p>
      <p className="text-sm text-gray-600 mb-4">Location :{isReceiverBlocked ? "Unknown" : "INDIA"}</p>
      <p className="text-sm text-gray-600 mb-4">Status: {isReceiverBlocked ? "Unavailable" : "Online"}</p>
    </div>

    {/* Buttons */}
    <div className="p-4 border-t">
      <button
        className="w-full py-2 mb-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        disabled={isCurrentUserBlocked}
        style={{
          cursor: !isCurrentUserBlocked ? 'pointer' : 'not-allowed', // Change cursor dynamically
        }}
        onClick={handleBlockUser}
      >
        {isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "Unblock User" : "Block User"}
      </button>
      <button
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </div>
  )

};

export default UserDetail;
