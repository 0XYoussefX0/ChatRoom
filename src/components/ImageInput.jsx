import { useState } from "react"
import "../styling/ChatRoom.css"
import uploadIcon from "../assets/icons/uploadIcon.svg"
import closeIcon from "../assets/icons/closeIcon.png"
import { storage } from "../utils/firebase.jsx"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuid } from "uuid"
import sendIcon from "../assets/icons/sendIcon.png"
import {
  doc,
  Timestamp,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp as firestoreServerTimestamp,
} from "firebase/firestore"
import { firestore } from "../utils/firebase.jsx"
import { useChat } from "../contexts/ChatContext.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"

function ImageInput(props) {
  const { data } = useChat()
  const { currentUser } = useAuth()

  const [image, setImage] = useState(null)

  const close = () => {
    setImage(null)
    props.setImageInputIsFocused(false)
  }

  const sendImage = async () => {
    const imagesRef = ref(storage, "images/" + uuid())

    await uploadBytes(imagesRef, image)

    await getDownloadURL(imagesRef).then(async (url) => {
      const messageid = uuid()
      await updateDoc(doc(firestore, "chats", data.chatId), {
        messages: arrayUnion({
          id: messageid,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          sentImage: url,
        }),
      })

      await updateDoc(doc(firestore, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          sentImage: "image",
        },
        [data.chatId + ".date"]: firestoreServerTimestamp(),
      })

      await updateDoc(doc(firestore, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          sentImage: "image",
        },
        [data.chatId + ".date"]: firestoreServerTimestamp(),
      })
    })

    setImage("")
    props.setImageInputIsFocused(false)
  }
  {
    image && props.setImageInputIsFocused(true)
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          flex: props.imageInputIsFocused ? "1" : null,
        }}
      >
        <label htmlFor="image-input">
          <img src={uploadIcon} className="uploadIcon" />
        </label>
        <input
          type="file"
          accept="image/*"
          id="image-input"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {image && (
          <>
            <div className="pickedImageContainer">
              <img src={URL.createObjectURL(image)} alt="Selected image" />
              <button type="button" className="closeButton" onClick={close}>
                <img src={closeIcon} />
              </button>
            </div>
            <button onClick={sendImage} type="button" className="sendButton">
              <img src={sendIcon} />
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default ImageInput
