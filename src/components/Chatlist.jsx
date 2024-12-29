import React, { useEffect, useState } from "react";
import { dbFirestore, useFirebase } from "../Firebase/Firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useChatcontext } from "../context/Chatcontext";

const ChatList = ({ onClick }) => {
  let [chats, setChats] = useState([])
  const { currentUser } = useFirebase();
  const { changeChat, chatId, handlechatId } = useChatcontext()
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unSub = onSnapshot(
      doc(dbFirestore, "userChats", currentUser.uid),

      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(dbFirestore, 'users', item.receiverId)
          const userDocSnap = await getDoc(userDocRef)

          const user = userDocSnap.data()
          return { ...item, user };
        })
        const chatData = await Promise.all(promises)
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
      }
    );
    return () => unSub();
  }, [currentUser?.uid]);

  const handleSelect = async (chat) => {
    try {
      changeChat(chat.chatId, chat.user, chat.user.blocked)
    }
    catch (err) {
      console.log(err)
    }
  }
  return (
    <div className=" h-screen bg-white border-r flex flex-col">

      <div className="p-4 bg-gray-100 border-b sticky top-0 z-10 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onClick}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Add"
        >
          +
        </button>
      </div>
      {/* Chat Items */}
      <div className="flex-1 ">
        {chats.map((chat) => (
          <div className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" key={chat.chatId} onClick={() => handleSelect(chat)}>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="ml-3">
              <div >
                <h3 className="font-medium text-gray-800">{chat.user.firstName}</h3>
                <p className="text-sm text-gray-600">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div >
  );
};

export default ChatList;
