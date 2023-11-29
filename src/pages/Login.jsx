import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import BackIcon from "../assets/icons/BackIcon.svg"
import facebookLogo from "../assets/socialMediaLogos/facebookLogo.svg"
import twitterLogo from "../assets/socialMediaLogos/twitterLogo.svg"
import appleLogo from "../assets/socialMediaLogos/appleLogo.svg"
import googleLogo from "../assets/socialMediaLogos/googleLogo.svg"
import revealEye from "../assets/icons/revealEye.svg"
import alertIcon from "../assets/icons/alertIcon.png"

import { useAuth } from "../contexts/AuthContext.jsx"
import { auth } from "../utils/firebase.jsx"
import {
  setPersistence,
  inMemoryPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth"

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [emailIsValid, setEmailIsValid] = useState(true)
  const [passwordIsValid, setPasswordIsValid] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    login,
    signInWithFacebook,
    signInWithGoogle,
    signInWithApple,
    signInWithTwitter,
  } = useAuth()

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
      await login(email, password)
      navigate("/ChatRoom")
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setPasswordIsValid(false)
      } else if (error.code === "auth/user-not-found") {
        setEmailIsValid(false)
      }
    }
  }

  const facebookSignIn = async () => {
    try {
      await signInWithFacebook()
      navigate("/ChatRoom")
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const googleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate("/ChatRoom")
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const appleSignIn = async () => {
    try {
      await signInWithApple()
      navigate("/ChatRoom")
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const twitterSignIn = async () => {
    try {
      await signInWithTwitter()
      navigate("/ChatRoom")
    } catch (error) {
      console.log("Error:", error)
    }
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
            <h2>Login</h2>
            <p>Enter your email and password to login</p>
          </div>
          <div className="social-media-icons-wrapper">
            <img onClick={facebookSignIn} src={facebookLogo} />
            <img onClick={googleSignIn} src={googleLogo} />
            <img onClick={appleSignIn} src={appleLogo} />
            <img onClick={twitterSignIn} src={twitterLogo} />
          </div>
          <div className="OrDivider">
            <div className="OrLine"></div>
            <p>or</p>
            <div className="OrLine"></div>
          </div>
          <form onSubmit={handleSubmit}>
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

              <label style={passwordLabelStyling} htmlFor="password">
                Password
              </label>
              <img onClick={togglePassword} src={revealEye} />
            </div>
            {passwordIsValid ? null : (
              <div className="errorBox">
                <img src={alertIcon} />
                <div className="error">Please Check your password</div>
              </div>
            )}

            <div className="RememberForgotWrapper">
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
              <Link to="/ForgotPassword">Forget password?</Link>
            </div>

            <input type="submit" value="Login" />
          </form>
          <div className="login-register-container">
            <div>Not registered yet ?</div>
            <Link to="/SignUp">Create an Account</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
