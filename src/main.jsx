import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { ChatProvider } from "./contexts/ChatContext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </React.StrictMode>
)
