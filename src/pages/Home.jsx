import { Link } from "react-router-dom"
import memoji from "../assets/MaleMemojis1.png"
import memoji2 from "../assets/MaleMemojis2.png"

function Home() {
  return (
    <>
      <div className="homePage">
        <nav>
          <ul>
            <li>
              <Link to="/">ChatBox</Link>
            </li>
            <li>
              <Link to="/Login">Login</Link>
            </li>
            <li>
              <Link to="/SignUp">Sign up</Link>
            </li>
          </ul>
          <div className="line"></div>
        </nav>
        <div className="homePageContent">
          <h1>
            Your Gateway to <span>Seamless</span> Online
            <br />
            Conversations and Meetings
          </h1>
          <img src={memoji} />
          <img src={memoji2} />
          <p>
            Experience seamless and secure remote communication with ChatBox,
            the
            <br />
            ultimate app for all your chatting and video conferencing needs;
            Stay connected
            <br />
            with friends, family, and colleagues from anywhere in the world.
          </p>
          <Link to="/SignUp">Get Started</Link>
        </div>
      </div>
    </>
  )
}

export default Home
