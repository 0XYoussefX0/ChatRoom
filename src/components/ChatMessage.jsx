import { useAuth } from "../contexts/AuthContext.jsx"
import "../styling/ChatRoom.css"
import { useRef } from "react"

export default function ChatMessage(props) {
  const { currentUser } = useAuth()
  const audioWrapper = useRef()

  const messageClass =
    props.message.senderId === currentUser.uid ? "sent" : "received"

  const messageDate = new Date(
    props.message.date.seconds * 1000 + props.message.date.nanoseconds / 1000000
  )
  const hours = messageDate.getHours()
  const minutes = messageDate.getMinutes()

  const messageTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${hours.toString().padStart(2, "0") < 12 ? "AM" : "PM"}`

  return (
    <>
      <div
        className={`theMessage ${messageClass}`}
        messageid={`${props.message.id}`}
      >
        <div>{props.message.formValue && props.message.formValue}</div>
        <div>
          {props.message.sentImage && <img src={props.message.sentImage} />}
        </div>
        <div>
          {props.message.sentAudio && (
            <div className="audioWrapper">
              <div></div>
              <audio
                ref={audioWrapper}
                id="audioWrapper"
                src={props.message.sentAudio}
                controls
              />
            </div>
          )}
        </div>

        <div className="sentMessageTime">{messageTime}</div>
      </div>
    </>
  )
}
