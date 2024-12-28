import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { dbFirestore, useFirebase } from "../Firebase/Firebase";
import { useChatcontext } from "../context/Chatcontext";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const ChatWindow = () => {
  const [chat, setChat] = useState()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [message, setMessage] = useState('');

  const { changeChat, changeBlock, chatId, user, isReceiverBlocked, isCurrentUserBlocked } = useChatcontext()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentUser } = useFirebase()



  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const endRef = useRef(null)

  const handleSent = async () => {
    if (text === "") return;
    try {
      await updateDoc(doc(dbFirestore, "chats", chatId), {
        message: arrayUnion({
          senderId: currentUser.uid,
          text,
          createdAt: new Date(),
        })
      })

      const userIDs = [currentUser.uid, user.uid]
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(dbFirestore, "userChats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)
        console.log(userChatsSnapshot)
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()
          debugger
          console.log(typeof (userChatsData))
          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.uid ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          })
        }
      })
    }
    catch (err) { }
  }

  //

  useEffect(() => {
    if (!chatId) return
    const unSub = onSnapshot(doc(dbFirestore, "chats", chatId),
      (res) => {
        setChat(res.data())
      })
    return () => { }
  }, [chatId])


  return (
    <div className="w-full lg:w-1/2 h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">

        {/* Left side: User info */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800">
              {isCurrentUserBlocked || isReceiverBlocked ? "Webchat User" : user?.firstName}
            </h3>
            <p className="text-sm text-gray-600">Online</p>
          </div>
        </div>

        {/* Right side: Icons (Voice Call, Video Call, Search Chat) */}
        <div className="flex items-center space-x-5 ml-auto">
          <button className="w-9 h-9 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center" title="Voice Call">
            📞
          </button>
          <button className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" title="Video Call">
            🎥
          </button>
          <button className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" title="Search Chat">
            🔍
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* {
          [...Array(20)].map((_, index) => (
            <div key={index} className={`mb-4 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${index % 2 === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {index % 2 === 0 ? "This is a sent message." : "This is a received message."}
              </div>
            </div>
          ))
        } */}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t sticky bottom-0 flex items-center space-x-2">
        {/* Smiley Icon */}
        <button
          className="w-9 h-9 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300 text-xl"
          title="Add Emoji"
          onClick={toggleEmojiPicker}
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 right-0 z-10 w-64 bg-white border rounded-lg shadow-md">
            <Picker onSelect={handleEmojiClick} />
          </div>
        )}

        {/* Paperclip (Attachment) Icon */}
        <button
          className="w-9 h-9 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300 text-xl"
          title="Attach File"
        >
          📎
        </button>

        {/* Microphone Icon */}
        <button
          className="w-9 h-9 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300 text-xl"
          title="Record Voice"
        >
          🎤
        </button>

        {/* Message Input Field */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          style={{
            cursor: isCurrentUserBlocked || isReceiverBlocked ? 'not-allowed' : '', // Change cursor dynamically
          }}
          placeholder="Type your message..."
          className="flex-1 px-1 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Send Button */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={handleSent}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          style={{
            cursor: isCurrentUserBlocked || isReceiverBlocked ? 'not-allowed' : 'pointer', // Change cursor dynamically
          }}
        >
          Send
        </button>
      </div>
    </div>

  )

}
export default ChatWindow;
