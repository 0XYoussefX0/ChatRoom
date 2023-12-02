import React, { useRef, useEffect } from "react"
import micIcon from "../assets/icons/micIcon.svg"
import WaveSurfer from "wavesurfer.js"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js"

import { storage } from "../utils/firebase.jsx"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuid } from "uuid"
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
          await uploadBytes(audiosRef, blob)
          await getDownloadURL(audiosRef).then(async (url) => {
            const messageid = uuid()
            await updateDoc(doc(firestore, "chats", data.chatId), {
              messages: arrayUnion({
                id: messageid,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                sentAudio: url,
              }),
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
      }

      if (wavesurfer) {
        wavesurfer.destroy()
        wavesurfer = null
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
          recButton.current.disabled = false
        })
      }
    }
  }, [])

  return (
    <>
      <div
        ref={waveformRef}
        id="waveform"
        style={{
          width: props.audioInputIsFocused ? "100%" : null,
        }}
      ></div>

      <button className="recordButton" ref={recButton} type="button">
        <img src={micIcon} className="micIcon" />
      </button>
    </>
  )
}

export default AudioRecorder
