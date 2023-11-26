import React from "react"
import "../styling/Loading.css"
function Loading() {
  return (
    <>
      <div className="loadingContainer">
        <div className="loading">Loading</div>
        <div className="spinner"></div>
      </div>
    </>
  )
}

export default Loading
