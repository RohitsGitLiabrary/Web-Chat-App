import React, { createContext, useContext, useState, useEffect } from 'react'
import { doc, onSnapshot, getDoc } from "firebase/firestore"
import { dbFirestore, useFirebase } from '../Firebase/Firebase'
import ChatList from '../components/Chatlist'

const ChatContext = createContext(null)

export const useChatcontext = () => useContext(ChatContext)

export const ChatcontextProvider = (props) => {

    const [chatId, setChatId] = useState(null);
    const [user, setUser] = useState(null)
    const [isCurrentUserBlocked, setIsCurrentUserBlocked] = useState(false)
    const [isReceiverBlocked, setIsReceiverBlocked] = useState(false)

    const { currentUser } = useFirebase()

    const [currentUserBlockedArray, setCurrentUserBlockedArray] = useState([]);
    const [receiverBlockedArray, setReceiverBlockedArray] = useState([]);
    //const [receiverBlockedArrayInitialize, setReceiverBlockedArrayInitialize] = useState(false)

    // Subscribe to both users' data in real-time
    useEffect(() => {
        if (!currentUser) return
        const unSubCurrentUser = onSnapshot(doc(dbFirestore, "users", currentUser.uid), async (doc) => {
            setCurrentUserBlockedArray(doc.data().blocked)
        });

    }, [currentUser, chatId, user, currentUserBlockedArray])


    const handlechatId = (chatId, user) => {
        return (chatId, user)
    }


    const changeChat = async (chatId, user, usersBlockedArray) => {

        setReceiverBlockedArray(usersBlockedArray)
        console.log("Context :", receiverBlockedArray)

        if (currentUserBlockedArray.includes(user.uid)) {
            setChatId(chatId);
            setUser(user);
            setIsCurrentUserBlocked(false);
            setIsReceiverBlocked(true)
        }

        // CHECK IF  RECEIVER IS BLOCKED
        else if (usersBlockedArray.includes(currentUser.uid)) {
            setChatId(chatId);
            setUser(null);
            setIsCurrentUserBlocked(true);
            setIsReceiverBlocked(false)
        }

        else {
            setChatId(chatId);
            setUser(user);
            setIsCurrentUserBlocked(false);
            setIsReceiverBlocked(false)
        }

    }

    const changeBlock = () => {
        setIsReceiverBlocked((prev) => !prev)
    }

    return (
        <ChatContext.Provider
            value={{ changeChat, changeBlock, chatId, user, handlechatId, isReceiverBlocked, isCurrentUserBlocked, receiverBlockedArray }}
        >
            {props.children}
        </ChatContext.Provider>
    );
};

