import { useNavigate } from "react-router-dom"

import { useState, useEffect } from "react"

import ImageInput from "../components/ImageInput.jsx"

import { firestore } from "../utils/firebase.jsx"

import React, { useRef } from "react"
import "../styling/ChatRoom.css"
import logoutIcon from "../assets/icons/logout.svg"

import { database } from "../utils/firebase.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import {
  ref,
  onValue,
  set,
  onDisconnect,
  serverTimestamp as dbServerTimestamp,
} from "firebase/database"
import {
  serverTimestamp as firestoreServerTimestamp,
  doc,
  onSnapshot,
  updateDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore"
import ChatMessage from "../components/ChatMessage.jsx"
import Search from "../components/Search.jsx"

import { useChat } from "../contexts/ChatContext.jsx"
import { v4 as uuid } from "uuid"

import AudioInput from "../components/AudioInput.jsx"

import AvatarPicker from "../components/AvatarPicker.jsx"
export default function ChatRoom() {
  const { currentUser, logout } = useAuth()
  const { data, dispatch } = useChat()
  const navigate = useNavigate()

  const emptyDiv = useRef()

  const [audioInputIsFocused, setAudioInputIsFocused] = useState(false)
  const [imageInputIsFocused, setImageInputIsFocused] = useState(false)
  const [textInputIsFocused, setTextInputIsFocused] = useState(false)

  const [avatar, setAvatar] = useState(undefined)
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState(undefined)

  const [formValue, setFormValue] = useState("")
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [typingState, setTypingState] = useState()
  const [online, setOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState("")

  const [showProfile, setShowProfile] = useState(true)

  useEffect(() => {
    emptyDiv.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (data.chatId) {
      const unSub = onSnapshot(doc(firestore, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages)
      })
      return () => {
        unSub()
      }
    }
  }, [data.chatId])

  useEffect(() => {
    if (typing && data.chatId) {
      updateDoc(doc(firestore, "userChats", currentUser.uid), {
        [data.chatId + ".typing"]: true,
      })
    } else if (!typing && data.chatId) {
      updateDoc(doc(firestore, "userChats", currentUser.uid), {
        [data.chatId + ".typing"]: false,
      })
    }
  }, [typing])

  useEffect(() => {
    if (data.user.uid) {
      const unSub = onSnapshot(
        doc(firestore, "userChats", data.user.uid),
        (doc) => {
          const combId = data.chatId
          doc.exists() && setTypingState(doc.data()[combId].typing)
        }
      )
      return () => {
        unSub()
      }
    }
  }, [data.user.uid])

  useEffect(() => {
    let userStatusDatabaseRef = ref(database, "/status/" + currentUser.uid)

    let isOfflineForDatabase = {
      state: "offline",
      last_changed: dbServerTimestamp(),
    }

    let isOnlineForDatabase = {
      state: "online",
      last_changed: dbServerTimestamp(),
    }

    onValue(ref(database, ".info/connected"), (snapshot) => {
      if (snapshot.val() == false) {
        return
      }
      onDisconnect(userStatusDatabaseRef)
        .set(isOfflineForDatabase)
        .then(function () {
          set(userStatusDatabaseRef, isOnlineForDatabase)
        })
    })
  }, [])

  useEffect(() => {
    if (data.user.uid) {
      onValue(ref(database, "status/" + data.user.uid), (snapshot) => {
        setLastSeen(snapshot.val().last_changed)
        if (snapshot.val().state == "online") {
          setOnline(true)
        } else {
          setOnline(false)
        }
      })
    }
  }, [data.user.uid])

  const sendMessage = async (e) => {
    e.preventDefault()

    const messageid = uuid()
    await updateDoc(doc(firestore, "chats", data.chatId), {
      messages: arrayUnion({
        id: messageid,
        formValue,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    })

    await updateDoc(doc(firestore, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        formValue,
      },
      [data.chatId + ".date"]: firestoreServerTimestamp(),
    })

    await updateDoc(doc(firestore, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        formValue,
      },
      [data.chatId + ".date"]: firestoreServerTimestamp(),
    })

    setFormValue("")
  }

  const handleSelect2 = (selectedUser) => {
    setShowProfile(false)
    dispatch({ type: "CHANGE_USER", payload: selectedUser })
  }

  const messagesByDate = messages?.reduce((acc, msg) => {
    const date = new Date(
      msg.date.seconds * 1000 + msg.date.nanoseconds / 1000000
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(msg)
    return acc
  }, {})

  const handleLogout = async () => {
    try {
      dispatch({ type: "CLEAR_STATE" })
      await logout()
      navigate("/Login")
    } catch {}
  }

  return (
    <>
      {!avatar || !avatarBackgroundColor ? (
        <AvatarPicker
          avatar={avatar}
          setAvatar={setAvatar}
          avatarBackgroundColor={avatarBackgroundColor}
          setAvatarBackgroundColor={setAvatarBackgroundColor}
        />
      ) : null}
      {avatar && avatarBackgroundColor && (
        <div className="chatRoom">
          <div className="contentBody">
            <button
              className="profileToggleButton"
              onClick={() => setShowProfile(true)}
            >
              <svg
                width="12"
                height="22"
                viewBox="0 0 48 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4L44 44"
                  stroke="black"
                  stroke-width="8"
                  stroke-linecap="round"
                />
                <path
                  d="M44 44L4 84"
                  stroke="black"
                  stroke-width="8"
                  stroke-linecap="round"
                />
              </svg>
            </button>
            <div
              className={`profileContainer ${showProfile ? "slide-in" : null}`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <button
                className="profileToggleButton absolutePosition"
                onClick={() => setShowProfile(false)}
              >
                <svg
                  width="12"
                  height="22"
                  viewBox="0 0 48 88"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L44 44"
                    stroke="black"
                    stroke-width="8"
                    stroke-linecap="round"
                  />
                  <path
                    d="M44 44L4 84"
                    stroke="black"
                    stroke-width="8"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
              <div
                style={{
                  display: "flex",
                  gap: "11px",
                  margin: "11px 0px 0px 28px",
                  alignItems: "center",
                }}
              >
                <img
                  src={avatar}
                  style={{
                    backgroundColor: `${avatarBackgroundColor}`,
                    borderRadius: "12px",
                    width: "71px",
                    height: "71px",
                  }}
                />
                <div>
                  <div
                    style={{
                      color: "#000",
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "23px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {currentUser.displayName}
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      color: "#F92C2C",
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "12.5px",
                      fontWeight: "600",
                      border: "none",
                      background: "none",
                      gap: "5px",
                    }}
                  >
                    <img src={logoutIcon} />
                    Logout
                  </button>
                </div>
              </div>
              <Search
                handleSelect2={handleSelect2}
                avatar={avatar}
                color={avatarBackgroundColor}
              />
            </div>
            <div className="line2"></div>
            <div className="chatInterface">
              {data.user.avatar && (
                <div className="statusIndicators">
                  <div style={{ position: "relative" }}>
                    <img
                      src={data.user.avatar}
                      style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: `${data.user?.color}`,
                        fontSize: "2.5rem",
                      }}
                      className="sidebar-bottom-user-image"
                    />
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        backgroundColor: `${online ? "#77ed91" : "#908E91"}`,
                      }}
                    ></div>
                  </div>

                  <div>
                    {data.user.displayName && (
                      <div className="chat-partner-name">
                        {data.user?.displayName}
                      </div>
                    )}
                    {!typingState && (
                      <div
                        className="chat-partner-status"
                        style={{
                          color: `${online ? "#77ed91" : "#908E91"}`,
                        }}
                      >
                        {online
                          ? "Online"
                          : lastSeen &&
                            `Last Seen ${new Date(lastSeen).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}`}
                      </div>
                    )}
                    <div className="typingIndicator">
                      {typingState && "Typing ..."}
                    </div>
                  </div>
                </div>
              )}

              <div className="line3"></div>
              <div className="conversationArea">
                {data.chatId && (
                  <>
                    <div className="chatWindow" style={{ maxHeight: "82vh" }}>
                      {messages &&
                        Object.entries(messagesByDate).map(([date, msgs]) => {
                          const Today = new Date()
                          const newDate = new Date(date)
                          return (
                            <div className="chatWindow2" key={date}>
                              <div className="dateHeader">
                                {Math.floor(
                                  (Today.getTime() - newDate.getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ) === 0
                                  ? "Today"
                                  : Math.floor(
                                      (Today.getTime() - newDate.getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) === 1
                                  ? "Yesterday"
                                  : date}
                              </div>
                              {msgs.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                              ))}
                            </div>
                          )
                        })}
                      <div ref={emptyDiv} style={{ marginTop: "14px" }}></div>
                    </div>

                    <form
                      onSubmit={sendMessage}
                      className="chatInput"
                      style={{
                        height: imageInputIsFocused ? "300px" : "68px",
                      }}
                    >
                      {textInputIsFocused || audioInputIsFocused ? null : (
                        <ImageInput
                          setImageInputIsFocused={setImageInputIsFocused}
                          imageInputIsFocused={imageInputIsFocused}
                        />
                      )}
                      {imageInputIsFocused || audioInputIsFocused ? null : (
                        <input
                          style={{
                            padding: textInputIsFocused ? "0 16px" : null,
                          }}
                          type="text"
                          placeholder="Start typing..."
                          value={formValue}
                          onChange={(e) => setFormValue(e.target.value)}
                          onFocus={() => {
                            setTyping(true)
                            setTextInputIsFocused(true)
                          }}
                          onBlur={() => {
                            setTyping(false)
                            setTextInputIsFocused(false)
                          }}
                        />
                      )}
                      {textInputIsFocused || imageInputIsFocused ? null : (
                        <AudioInput
                          setAudioInputIsFocused={setAudioInputIsFocused}
                          audioInputIsFocused={audioInputIsFocused}
                        />
                      )}
                      {/*
                      <button type="submit" className="submitChatInput">
                        <img src={sendIcon} />
                      </button>
                      
                      */}
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
