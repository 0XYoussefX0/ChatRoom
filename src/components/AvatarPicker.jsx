import { useState, useEffect } from "react"

import avatar1 from "../assets/Avatar-1.png"
import avatar2 from "../assets/Avatar-2.png"
import avatar3 from "../assets/Avatar-3.png"
import avatar4 from "../assets/Avatar-4.png"
import avatar5 from "../assets/Avatar-5.png"
import avatar6 from "../assets/Avatar-6.png"
import avatar7 from "../assets/Avatar-7.png"
import avatar8 from "../assets/Avatar-8.png"
import avatar9 from "../assets/Avatar-9.png"
import avatar10 from "../assets/Avatar-10.png"

import Loading from "./Loading.jsx"
import { HexColorPicker } from "react-colorful"

import { firestore } from "../utils/firebase.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"

import { doc, getDoc, updateDoc } from "firebase/firestore"

function Avatar(props) {
  const [color, setColor] = useState("#ffffff")

  const { currentUser } = useAuth()

  useEffect(() => {
    const docRef = doc(firestore, "users", currentUser.uid)
    getDoc(docRef).then((docSnap) => {
      if (docSnap.data().avatar) {
        props.setAvatar(docSnap.data().avatar)
        props.setAvatarBackgroundColor(docSnap.data().color)
      } else {
        console.log("Error")
        props.setAvatar(null)
      }
    })
  }, [])

  const storeAvatar = async (e) => {
    e.preventDefault()
    try {
      await updateDoc(doc(firestore, "users", currentUser.uid), {
        avatar: props.avatar,
        color,
      })
      props.setAvatarBackgroundColor(color)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  const pickAvatar = (avatar) => {
    props.setAvatar(avatar)
    props.setAvatarBackgroundColor(null)
  }

  return (
    <>
      {props.avatar === null && (
        <div className="avatarPage">
          <h1>Choose Your Avatar</h1>
          <div className="avatarPicker">
            <img src={avatar1} onClick={() => pickAvatar(avatar1)} />
            <img src={avatar2} onClick={() => pickAvatar(avatar2)} />
            <img src={avatar3} onClick={() => pickAvatar(avatar3)} />
            <img src={avatar4} onClick={() => pickAvatar(avatar4)} />
            <img src={avatar5} onClick={() => pickAvatar(avatar5)} />

            <img src={avatar6} onClick={() => pickAvatar(avatar6)} />
            <img src={avatar7} onClick={() => pickAvatar(avatar7)} />
            <img src={avatar8} onClick={() => pickAvatar(avatar8)} />
            <img src={avatar9} onClick={() => pickAvatar(avatar9)} />
            <img src={avatar10} onClick={() => pickAvatar(avatar10)} />
          </div>
        </div>
      )}
      {props.avatarBackgroundColor === null && (
        <div className="avatarPage">
          <h1>Pick a Color</h1>
          <div className="colorPicker">
            <div>
              <img
                style={{
                  backgroundColor: `${color}`,
                  borderRadius: "31px",
                  maxWidth: "300px",
                  width: "100%",
                }}
                src={props.avatar}
              />
              <HexColorPicker color={color} onChange={setColor} />
            </div>
            <button onClick={storeAvatar}>Done</button>
          </div>
        </div>
      )}
      {props.avatar === undefined && <Loading />}
    </>
  )
}

export default Avatar
