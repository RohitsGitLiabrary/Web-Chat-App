import React, { useState } from "react";
import { collection, query, where, or, getDocs, setDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { dbFirestore, useFirebase } from "../Firebase/Firebase";

const AddFriend = ({ isOpen, onClose }) => {
  const { currentUser } = useFirebase();
  const [searchName, setSearchName] = useState(null)
  const [user, setUser] = useState(null)
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSearchName(null)
      setUser(null)
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const usersRef = collection(dbFirestore, "users");
      console.log(usersRef)
      const q = query(usersRef,
        or(
          where('firstName', '==', searchName), where('lastName', '==', searchName), where('username', '==', searchName)));
      const querySnapShot = await getDocs(q)
      console.log(querySnapShot)
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data())
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  const handleAdd = async () => {
    const chatRef = collection(dbFirestore, "chats")
    const userChatsRef = collection(dbFirestore, "userChats")
    try {
      const newChatRef = doc(chatRef)

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })
      console.log(user.uid)
      console.log(currentUser.uid)

      if (user.uid === currentUser.uid) {
        await updateDoc(doc(userChatsRef, user.uid), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: currentUser.uid,
            updatedAt: Date.now()
          })
        })
      }
      else {
        await updateDoc(doc(userChatsRef, user.uid), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: currentUser.uid,
            updatedAt: Date.now()
          })
        })
        await updateDoc(doc(userChatsRef, currentUser.uid), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: user.uid,
            updatedAt: Date.now(),
          })
        })
      }
    }
    catch (err) { console.log(err) }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      {/* Popup Container */}
      <div className="relative w-full max-w-md bg-white border shadow-lg rounded-lg p-6 pt-12 z-10">
        {/* Close Icon */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for users..."
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Example User Results */}

        {user &&
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{user.firstName} {user.lastName}</span>
              </div>
              <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
        }

      </div>
    </div>
  );
};

export default AddFriend;
