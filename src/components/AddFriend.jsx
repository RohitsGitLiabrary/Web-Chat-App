import React, { useState } from "react";
import { collection, query, where, or, getDocs, setDoc, serverTimestamp, doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { dbFirestore, useFirebase } from "../Firebase/Firebase";

const AddFriend = ({ isOpen, onClose }) => {
  const { currentUser } = useFirebase();
  const [searchName, setSearchName] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setSearchName(null)
      setSearchResults([])

      onClose();
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResults([])

    try {
      const q = query(collection(dbFirestore, "users"), or(where('firstName', '==', searchName), where('lastName', '==', searchName), where('username', '==', searchName)));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });

        console.log("This is results :", results);
        setSearchResults((prevResults) => [...prevResults, ...results])
      });
      return () => unsubscribe();
    }
    catch (err) {
      console.log(err.code)
    }
  }
  console.log("This is searchResults :", searchResults)

  const handleAdd = async (userUID) => {
    const chatRef = collection(dbFirestore, "chats")
    const userChatsRef = collection(dbFirestore, "userChats")

    try {
      const newChatRef = doc(chatRef)

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })
      console.log(userUID)
      console.log(currentUser.uid)

      if (userUID === currentUser.uid) {
        await updateDoc(doc(userChatsRef, userUID), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: currentUser.uid,
            updatedAt: Date.now()
          })
        })
      }
      else {
        await updateDoc(doc(userChatsRef, userUID), {
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
            receiverId: userUID,
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
          onClick={handleOverlayClick}
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

        {searchResults && searchResults.map((result) =>
          <div div className="mt-4 space-y-4" >
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-4">
                <img
                  src={result.imgURL}
                  alt="UserPhoto"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{result.firstName} {result.lastName}</span>
              </div>
              <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => handleAdd(result.uid)}
              >
                Add
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AddFriend;
