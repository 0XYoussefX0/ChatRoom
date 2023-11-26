import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import BackIcon from "../assets/BackIcon.svg"
import facebookIcon from "../assets/facebookIcon.svg"
import twitterIcon from "../assets/twitterIcon.svg"
import appleIcon from "../assets/appleIcon.svg"
import googleIcon from "../assets/googleIcon.svg"
import revealEye from "../assets/revealEye.svg"
import alertIcon from "../assets/alertIcon.png"
import { auth } from "../firebase.jsx"

import { useAuth } from "../contexts/AuthContext.jsx"
import { doc, setDoc } from "firebase/firestore"
import { firestore } from "../firebase.jsx"
import {
  setPersistence,
  inMemoryPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth"

function SignUp() {
  const [username, setUsername] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [usernameIsValid, setUsernameIsValid] = useState(true)
  const [emailIsValid, setEmailIsValid] = useState(true)
  const [passwordIsValid, setPasswordIsValid] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)

  const { signup, updateTheUserName } = useAuth()

  const navigate = useNavigate()

  if (rememberMe) {
    console.log(rememberMe)
    /*not working for some odd reason*/
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("success")
      })
      .catch((e) => console.log(e))
  } else {
    setPersistence(auth, browserSessionPersistence)
  }

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible)
  }

  const isusernameValid = () => {
    setUsernameIsValid(!(username == ""))
  }

  const isEmailValid = () => {
    setEmailIsValid(email.includes("@"))
  }

  const isPasswordValid = () => {
    /*regular expression for minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:*/
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    setPasswordIsValid(regex.test(password))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await signup(email, password)
      await updateTheUserName(username)
        .then(() => console.log("noice"))
        .catch(() => console.log("so bad"))
      await setDoc(doc(firestore, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: username,
        email,
      })
      await setDoc(doc(firestore, "userChats", res.user.uid), {})
      navigate("/ChatRoom")
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setPasswordIsValid(false)
      } else if (error.code === "auth/user-not-found") {
        setEmailIsValid(false)
      }
    }
  }

  const usernameLabelStyling = {
    color: usernameIsValid ? null : "red",
    ...(username !== "" && {
      top: "0",
      fontSize: "12px",
      background: "white",
      padding: "0 0.4rem",
    }),
  }

  const emailLabelStyling = {
    color: emailIsValid ? null : "red",
    ...(email !== "" && {
      top: "0",
      fontSize: "12px",
      background: "white",
      padding: "0 0.4rem",
    }),
  }

  const passwordLabelStyling = {
    color: passwordIsValid ? null : "red",
    ...(password !== "" && {
      top: "0",
      fontSize: "12px",
      background: "white",
      padding: "0 0.4rem",
    }),
  }

  return (
    <>
      <div className="SignUp">
        <Link to="/">
          <div className="backLink">
            <div>
              <img src={BackIcon} />
            </div>
            Back to Landing Page
          </div>
        </Link>
        <div className="SignUpBox">
          <div className="SignUpHeader">
            <h2>Sign Up</h2>
            <p>Enter your email and password to sign in</p>
          </div>
          <div className="social-media-icons-wrapper">
            <img src={facebookIcon} />
            <img src={googleIcon} />
            <img src={appleIcon} />
            <img src={twitterIcon} />
          </div>
          <div className="OrDivider">
            <div className="OrLine"></div>
            <p>or</p>
            <div className="OrLine"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <input
                className={usernameIsValid ? null : "invalid"}
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={isusernameValid}
                autoComplete="username"
              />
              <label style={usernameLabelStyling} htmlFor="username">
                Username
              </label>
            </div>
            {usernameIsValid ? null : (
              <div className="errorBox">
                <img src={alertIcon} />
                <div className="error">Please Check your username</div>
              </div>
            )}

            <div className="inputGroup">
              <input
                className={emailIsValid ? null : "invalid"}
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={isEmailValid}
                autoComplete="email"
              />
              <label style={emailLabelStyling} htmlFor="email">
                Email
              </label>
            </div>
            {emailIsValid ? null : (
              <div className="errorBox">
                <img src={alertIcon} />
                <div className="error">Please Check your email</div>
              </div>
            )}

            <div className="inputGroup">
              <input
                className={passwordIsValid ? null : "invalid"}
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={isPasswordValid}
                autoComplete="current-password"
              />

              <img onClick={togglePassword} src={revealEye} />
              <label style={passwordLabelStyling} htmlFor="password">
                Password
              </label>
            </div>
            {passwordIsValid ? null : (
              <div className="errorBox">
                <img src={alertIcon} />
                <div className="error">Please Check your password</div>
              </div>
            )}

            <div className="RememberForgotWrapper">
              {
                <label className="RememberLabel">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => {
                      setRememberMe(!rememberMe)
                    }}
                  />
                  Keep me logged in
                </label>
              }
            </div>

            <input type="submit" value="Sign Up" />
          </form>
          <div className="login-register-container">
            <div>Already have an account ?</div>
            <Link to="/Login">Login here</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
