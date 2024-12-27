import ChatList from "../components/Chatlist";
import ChatWindow from "../components/Chatwindow";
import UserDetails from "../components/Userdetails";
import { React, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useFirebase, firebaseAuth } from "../Firebase/Firebase";
import Loggedinuserdetail from "../components/Loggedinuserdetail";
import AddFriend from "../components/AddFriend";
import { useChatcontext } from "../context/Chatcontext";

const Loggedinwndow = () => {
  const firebaseContext = useFirebase();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { chatId } = useChatcontext();

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      try {
        firebaseContext.fetchUserInfo(user.uid);
      } catch (err) {
        console.log("UID not found");
      }
    });
  }, []);
  return (
    <div className="min-h-screen flex bg-gray-100">
      <div
        className={`${chatId ? "w-1/4" : "w-full"
          } h-screen bg-white border-r flex flex-col transition-all duration-300`}
      >
        {/* Logged-in User Detail */}
        <div className="flex-shrink-0">
          <Loggedinuserdetail />
        </div>
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList onClick={() => setIsPopupOpen(true)} />
        </div>
      </div>
      {chatId && < ChatWindow />}
      <AddFriend isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      {chatId && < UserDetails />}
    </div >
  );
};

export default Loggedinwndow;
