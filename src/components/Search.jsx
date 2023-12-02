import React, { useEffect } from "react"
import { useState } from "react"
import "../styling/ChatRoom.css"
import micIcon from "../assets/icons/micIcon.svg"

import imageIcon from "../assets/icons/imageIcon.png"
import searchIcon from "../assets/icons/searchIcon.svg"
import { firestore } from "../utils/firebase.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore"

function Search(props) {
  const [userName, setUserName] = useState("")
  const [user, setUser] = useState("")

  const [chats, setChats] = useState([])

  const { currentUser } = useAuth()

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(firestore, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data())
        }
      )
      return () => {
        unsub()
      }
    }
    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleInput = (e) => {
    e.key === "Enter" && searchForUser()
  }

  const searchForUser = async () => {
    const q = query(
      collection(firestore, "users"),
      where("displayName", "==", userName)
    )

    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      })
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid

    try {
      const res = await getDoc(doc(firestore, "chats", combinedId))

      if (!res.exists()) {
        await setDoc(doc(firestore, "chats", combinedId), {})

        await updateDoc(doc(firestore, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            avatar: user.avatar,
            color: user.color,
          },
          [combinedId + ".date"]: serverTimestamp(),
        })

        await updateDoc(doc(firestore, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            avatar: props.avatar,
            color: props.color,
          },
          [combinedId + ".date"]: serverTimestamp(),
        })
      }
    } catch (err) {
      console.log(err, "Error")
    }

    setUser("")
    setUserName("")
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
      <div className="searchSection">
        <div className="searchBox">
          <img src={searchIcon} />
          <input
            placeholder="Search"
            type="text"
            onKeyDown={handleInput}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
      </div>
      {user && (
        <div>
          <div className="messageWrapper" onClick={handleSelect}>
            <img
              className="sidebar-bottom-user-image"
              src={user.avatar}
              style={{ backgroundColor: `${user.color}` }}
            />
            <div className="messageBox">
              <div>
                <div className="messageSender">{user.displayName}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="friendsList">
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            const date = new Date(
              chat[1].date?.seconds * 1000 + chat[1].date?.nanoseconds / 1000000
            )
            const hours = date.getHours()
            const minutes = date.getMinutes()

            const messageTime = `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`

            return (
              <div key={chat[0]}>
                <div
                  className="messageWrapper"
                  onClick={() => {
                    props.handleSelect2(chat[1].userInfo)
                  }}
                >
                  <img
                    className="sidebar-bottom-user-image"
                    src={chat[1].userInfo?.avatar}
                    style={{
                      backgroundColor: `${chat[1].userInfo?.color}`,
                    }}
                  />
                  <div className="messageBox">
                    <div>
                      <div className="messageSender">
                        {chat[1].userInfo?.displayName}
                      </div>
                      <div className="message">
                        {chat[1].lastMessage?.formValue}
                        {chat[1].lastMessage?.sentImage && (
                          <div className="skeletonImageContainer">
                            <img src={imageIcon} />
                            <div>Image</div>
                          </div>
                        )}
                        {chat[1].lastMessage?.sentAudio && (
                          <div className="skeletonAudioContainer">
                            <img src={micIcon} />
                            <div>Audio</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="messageInfo">
                      <div className="messageTime">{messageTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Search
