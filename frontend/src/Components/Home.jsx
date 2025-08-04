import React, { useState } from "react";
import { useUserContext } from "./UserContext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import c1 from "./images/c1.jpg";
import c2 from "./images/html.png";
import c3 from "./images/sql.jpg";
import c4 from "./images/python.jpg";
import c5 from "./images/java.png";
import c6 from "./images/css.png";
import "./css/style.css";
import {
  faGraduationCap,
  faAward,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "./header and footer/Footer";
import { faRobot } from "@fortawesome/free-solid-svg-icons";


function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  /*const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Bot: How can I assist you today?" },
        ]);
      }, 1000);
      setUserInput("");
    }
  };*/
  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const userMessage = userInput;

      // Show user message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userMessage },
      ]);
      setUserInput("");

      try {
        const response = await fetch("http://localhost:8080/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.reply },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: "Sorry, I couldn't reach the server. Please try again later.",
          },
        ]);
      }
    }
  };


  return (
    <div>
      <Navbar page={"home"} />

      <section id="home">
        <h2>Unlock Your Potential with E-Learning Academy</h2>
        <p>
          E-Learning Academy empowers you to shape your future through
          world-class online education. Dive into expertly crafted courses
          featuring interactive lessons, real-world projects, and hands-on
          assessments — all designed to help you learn faster, smarter, and on
          your own schedule.
        </p>

        <div className="btn">
           <Link className="blue" to="/find-interest">
                      Find Your Interest
                    </Link>
          <a className="yellow" href="http://localhost:3000/courses">Visit Courses</a>
        </div>
      </section>

      <section id="features">
        <h1>Awesome Features</h1>
        <p>Chance to enhance yourself</p>
        <div className="fea-base">
          <div className="fea-box">
            <FontAwesomeIcon icon={faGraduationCap} className="i" />
            <h3>Scholarship Facility</h3>
            <p>Originality is the essence of true scholarship.</p>
          </div>
          <div className="fea-box">
            <FontAwesomeIcon icon={faStar} className="i" />
            <h3>Valuable Courses</h3>
            <p>Online education is like a rising tide, it's going to lift all boats.</p>
          </div>
          <div className="fea-box">
            <FontAwesomeIcon icon={faAward} className="i" />
            <h3>Global Certification</h3>
            <p>A certificate without knowledge is like a gun without bullets.</p>
          </div>
        </div>
      </section>

      <section id="course" style={{ marginBottom: "20px" }}>
        <h1>Our Popular Courses</h1>
        <p>10,000+ enrolled</p>
        <div className="course-box">
          {[{ img: c1, title: "JavaScript Beginner Course" }, { img: c2, title: "HTML Complete Course" }, { img: c3, title: "SQL Beginner Course" }, { img: c4, title: "Python Master Course" }, { img: c5, title: "Java Essentials" }, { img: c6, title: "CSS Complete Course" }].map((course, i) => (
            <div className="courses" key={i}>
              <img src={course.img} alt={course.title} />
              <div className="details">
                <p>Updated 12/08/23</p>
                <h6>{course.title}</h6>
                <div className="star">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="i" />
                  ))}
                  <p>(239)</p>
                </div>
              </div>
              <div className="cost">₹ 500</div>

            </div>
          ))}
        </div>
      </section>

      {/* 🎯 Updated Contact Section - Clean and Centered */}
      <section id="contact">
        <div className="contact-container">
          <h1>Contact Us</h1>
          <p>We’d love to hear from you. Reach out through any channel below.</p>
          <div className="contact-grid">
            <div className="contact-card">
              <i className="fas fa-phone contact-icon"></i>
              <h3>Phone</h3>
              <p><a href="tel:+919082635150">+91 9082635150</a></p>
            </div>
            <div className="contact-card">
              <i className="fas fa-envelope contact-icon"></i>
              <h3>Email</h3>
              <p><a href="mailto:suchitbhonkar@outlook.com">suchitbhonkar@outlook.com</a></p>
            </div>
            <div className="contact-card">
              <i className="fab fa-linkedin contact-icon"></i>
              <h3>LinkedIn</h3>
              <p><a href="https://www.linkedin.com/in/suchitbhonkar/" target="_blank" rel="noreferrer">Visit Profile</a></p>
            </div>
          </div>
        </div>

        <style>{`
          #contact {
            background-color: #f9f9f9;
            padding: 60px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
          }

          .contact-container {
            max-width: 1200px;
            width: 100%;
          }

          .contact-container h1 {
            font-size: 36px;
            color: #333;
            margin-bottom: 10px;
          }

          .contact-container p {
            margin-bottom: 40px;
            color: #555;
          }

          .contact-grid {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 30px;
          }

          .contact-card {
            background: white;
            border-radius: 10px;
            padding: 25px 20px;
            width: 280px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
          }

          .contact-card:hover {
            transform: translateY(-6px);
          }

          .contact-icon {
            font-size: 28px;
            color: #6a1b9a;
            margin-bottom: 12px;
          }

          .contact-card h3 {
            font-size: 20px;
            color: #222;
            margin-bottom: 8px;
          }

          .contact-card a {
            color: #6a1b9a;
            text-decoration: none;
            font-weight: 600;
          }

          .contact-card a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .contact-grid {
              flex-direction: column;
              align-items: center;
            }

            .contact-card {
              width: 90%;
            }
          }
            .chatbot-icon {
              position: fixed;
              bottom: 30px;
              right: 30px;
              background-color: #6a1b9a;
              color: #fff;
              border: none;
              border-radius: 50%;
              padding: 14px 16px;
              font-size: 20px;
              cursor: pointer;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
              z-index: 999;
              transition: background-color 0.3s;
            }

            .chatbot-icon:hover {
              background-color: #53157a;
            }

            .chatbot-wrapper {
  position: fixed;
  bottom: 90px;
  right: 30px;
  z-index: 1000;
}

.chatbot-window {
  width: 320px;
  height: 450px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

.chatbot-header {
  background-color: #6a1b9a;
  color: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.chatbot-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-bubble {
  padding: 10px 14px;
  max-width: 75%;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-bubble.bot {
  background-color: #eee5ff;
  align-self: flex-start;
  color: #333;
}

.message-bubble.user {
  background-color: #6a1b9a;
  color: white;
  align-self: flex-end;
}

.chatbot-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: #fff;
}

.chatbot-input input {
  flex-grow: 1;
  border-radius: 20px;
  border: 1px solid #ccc;
  padding: 8px 12px;
  font-size: 14px;
}

.send-btn {
  margin-left: 8px;
  background-color: #6a1b9a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
}

.chatbot-icon {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 14px 16px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.chatbot-icon:hover {
  background-color: #53157a;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



        `}</style>
      </section>

      {/* Chatbot UI */}
      <div className="chatbot-wrapper">
  {isChatOpen && (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <h4><FontAwesomeIcon icon={faRobot} /> Chatbot</h4>
        <button
          className="close-btn"
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Close Chat"
        >
          ✖
        </button>
      </div>
      <div className="chatbot-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Message..."
        />
        <button onClick={handleSendMessage} className="send-btn">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  )}
  <button className="chatbot-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
    <FontAwesomeIcon icon={faRobot} />
  </button>
</div>



      <Footer />
    </div>
  );
}

export default Home;
