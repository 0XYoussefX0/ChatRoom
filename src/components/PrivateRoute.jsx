import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Outlet, Navigate } from "react-router-dom"
import Loading from "./Loading.jsx"

export default function PrivateRoute() {
  const { currentUser } = useAuth()

  try {
    if (currentUser === null) {
      return <Navigate to="/Login" />
    } else if (typeof currentUser === "object") {
      return <Outlet />
    } else if (currentUser === undefined) {
      return <Loading />
    }
  } catch (error) {
    console.log(error)
    return <p>An error occurred while checking authentication status.</p>
  }
}
