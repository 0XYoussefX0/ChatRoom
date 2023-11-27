import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Outlet, Navigate } from "react-router-dom"

export default function PrivateRoute() {
  const { currentUser } = useAuth()

  return currentUser ? <Outlet /> : <Navigate to="/Login" />
}
