import "./styling/App.css"
import ForgotPassword from "./pages/ForgotPassword"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"

import { BrowserRouter } from "react-router-dom"
import { Route, Routes } from "react-router-dom"

import PrivateRoute from "./PrivateRoute"
import ChatRoom from "./pages/ChatRoom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route element={<PrivateRoute />}>
            <Route path="/ChatRoom" element={<ChatRoom />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
