import React, { useContext, useReducer } from "react"
import { useAuth } from "./AuthContext.jsx"

import avatar1 from "../assets/avatars/Avatar-1.png"
import avatar2 from "../assets/avatars/Avatar-2.png"
import avatar3 from "../assets/avatars/Avatar-3.png"
import avatar4 from "../assets/avatars/Avatar-4.png"
import avatar5 from "../assets/avatars/Avatar-5.png"
import avatar6 from "../assets/avatars/Avatar-6.png"
import avatar7 from "../assets/avatars/Avatar-7.png"
import avatar8 from "../assets/avatars/Avatar-8.png"
import avatar9 from "../assets/avatars/Avatar-9.png"
import avatar10 from "../assets/avatars/Avatar-10.png"

const ChatContext = React.createContext()

export function useChat() {
  return useContext(ChatContext)
}

export function ChatProvider({ children }) {
  const { currentUser } = useAuth()

  const INITIAL_STATE = {
    chatId: null,
    user: {},
  }

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        }
      case "CLEAR_STATE":
        return INITIAL_STATE
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}
