import { useState } from "react"
import { Link } from "react-router-dom"

import alertIcon from "../assets/icons/alertIcon.png"
import BackIcon from "../assets/icons/BackIcon.svg"
import mailIcon from "../assets/icons/mailIcon.png"

import { useAuth } from "../contexts/AuthContext.jsx"

function ForgotPassword() {
  const [emailIsValid, setEmailIsValid] = useState(true)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(false)

  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await resetPassword(email)
      setMessage(true)
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const isEmailValid = () => {
    setEmailIsValid(email.includes("@"))
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

  return (
    <>
      <div className="resetPasswordPage">
        <Link to="/Login">
          <div className="backLink">
            <div>
              <img src={BackIcon} />
            </div>
            Back to Login Page
          </div>
        </Link>
        <div className="resetBox">
          <div className="SignUpHeader">
            <h2>Reset Your Password</h2>
            <p>Enter your email to reset your password</p>
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
            {message ? (
              <div className="InboxHint">
                <img src={mailIcon} />
                <div className="InboxMessage">
                  Check Your Inbox to Reset Your Password
                </div>
              </div>
            ) : null}

            <input type="submit" value="Reset" />
          </form>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
