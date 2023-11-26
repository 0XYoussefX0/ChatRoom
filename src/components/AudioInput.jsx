import React, { useRef, useEffect } from "react"
import micIcon from "../assets/micIcon.svg"
import WaveSurfer from "wavesurfer.js"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js"

import { storage } from "../firebase.jsx"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuid } from "uuid"
import {
  doc,
  Timestamp,
  setDoc,
  updateDoc,
  serverTimestamp as firestoreServerTimestamp,
} from "firebase/firestore"
import { firestore } from "../firebase.jsx"
import { useChat } from "../contexts/ChatContext.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"

function AudioRecorder(props) {
  const { data } = useChat()
  const { currentUser } = useAuth()
  const recButton = useRef()
  const waveformRef = useRef()

  useEffect(() => {
    let wavesurfer
    let record
    recButton.current.onclick = () => {
      if (record && record.isRecording()) {
        record.stopRecording()
        record.on("record-end", async (blob) => {
          const audiosRef = ref(storage, "audios/" + uuid())
          await uploadBytes(audiosRef, blob).then((snapshot) => {
            console.log("uploaded successfully")
          })
          await getDownloadURL(audiosRef).then(async (url) => {
            const messageid = uuid()
            const chatDocRef = doc(firestore, "chats", data.chatId)
            await setDoc(doc(chatDocRef, "messages", messageid), {
              id: messageid,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              seen: false,
              sentAudio: url,
            })

            await updateDoc(doc(firestore, "userChats", currentUser.uid), {
              [data.chatId + ".lastMessage"]: {
                sentAudio: "image",
              },
              [data.chatId + ".date"]: firestoreServerTimestamp(),
            })

            await updateDoc(doc(firestore, "userChats", data.user.uid), {
              [data.chatId + ".lastMessage"]: {
                sentAudio: "image",
              },
              [data.chatId + ".date"]: firestoreServerTimestamp(),
            })
          })
        })
        console.log("stopped recording")
      }

      if (wavesurfer) {
        wavesurfer.destroy()
        wavesurfer = null
        console.log(wavesurfer, "is destroyed")
        props.setAudioInputIsFocused(false)
      } else {
        props.setAudioInputIsFocused(true)
        wavesurfer = WaveSurfer.create({
          container: "#waveform",
          waveColor: "rgb(63, 82, 255)",
          progressColor: "rgb(100, 0, 100)",
          height: 47,
          barWidth: 3,
          barGap: 2,
          barRadius: 15,
        })
        record = wavesurfer.registerPlugin(RecordPlugin.create())
        recButton.current.disabled = true

        record.startRecording().then(() => {
          console.log("recording...")

          recButton.current.disabled = false
        })
      }
    }
  }, [])

  // Initialize the Record plugin

  // Render recorded audio

  return (
    <>
      <div
        ref={waveformRef}
        id="waveform"
        style={{
          width: props.audioInputIsFocused ? "100%" : null,
          maxHeight: "100%",
          margin: "10px",
        }}
      ></div>

      <button
        style={{ border: "none", background: "none" }}
        ref={recButton}
        type="button"
      >
        <img src={micIcon} className="micIcon" />
      </button>
    </>
  )
}

export default AudioRecorder
