import React, { useContext, useState, useEffect } from "react"
import { auth } from "../utils/firebase"
import {
  updateProfile,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  OAuthProvider,
  onAuthStateChanged,
} from "firebase/auth"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function signInWithFacebook() {
    const facebookProvider = new FacebookAuthProvider()
    return signInWithPopup(auth, facebookProvider)
  }

  function signInWithGoogle() {
    const googleProvider = new GoogleAuthProvider()
    return signInWithPopup(auth, googleProvider)
  }
  /*complete the configuration of the apple signIn after you join the apple developer program. "https://firebase.google.com/docs/auth/web/apple"*/
  function signInWithApple() {
    const appleProvider = new OAuthProvider("apple.com")
    return signInWithPopup(auth, appleProvider)
  }

  /* complete the configuration of the twitter signIn after you get a website domaine. "https://developer.twitter.com/en/portal/projects/1686088592961982464/apps/27559736/auth-settings" */
  function signInWithTwitter() {
    const twitterProvider = new TwitterAuthProvider()
    return signInWithPopup(auth, twitterProvider)
  }

  function updateTheUserName(username) {
    return updateProfile(auth.currentUser, { displayName: `${username}` })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signInWithTwitter,
    updateTheUserName,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
