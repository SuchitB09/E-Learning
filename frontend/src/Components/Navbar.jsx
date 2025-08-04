//navbar


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

function Navbar(props) {
  const value = props.page;
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("profileImage");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <nav>
       <Link to="/" className="brand-title">E-learning Platform</Link>
        

        <div className="navigation">
          <div id="menu-btn">
            <div className="menu-dash" onClick={toggleMobileMenu}>
              &#9776;
            </div>
          </div>
          <i
            id="menu-close"
            className="fas fa-times"
            onClick={closeMobileMenu}
          ></i>
          <ul className={isMobileMenuOpen ? "active" : ""}>
            {isMobileMenuOpen && (
              <li className="close-button">
                <button onClick={closeMobileMenu}>X</button>
              </li>
            )}
            <li style={value === "home" ? { backgroundColor: "purple", borderRadius: "5px" } : {}}>
              <Link to="/" style={value === "home" ? { color: "white", padding: "10px" } : {}}>Home</Link>
            </li>
            <li style={value === "courses" ? { backgroundColor: "purple", borderRadius: "5px" } : {}}>
              <Link to="/courses" style={value === "courses" ? { color: "white", padding: "10px" } : {}}>Courses</Link>
            </li>
            {authToken && (
              <li style={value === "profile" ? { backgroundColor: "purple", borderRadius: "5px" } : {}}>
                <Link to="/profile" style={value === "profile" ? { color: "white", padding: "10px" } : {}}>
                  Profile <FontAwesomeIcon icon={faUser} />
                </Link>
              </li>
            )}
            {authToken && (
              <li style={value === "learnings" ? { backgroundColor: "purple", borderRadius: "5px" } : {}}>
                <Link to="/learnings" style={value === "learnings" ? { color: "white", padding: "10px" } : {}}>
                  Learnings <FontAwesomeIcon icon={faChalkboardUser} />
                </Link>
              </li>
            )}
            {authToken !== null ? (
              <li>
                <button onClick={handleLogOut} className="sign-out-button">
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <button onClick={() => navigate("/login")}>Login/SignUp</button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Adding the CSS inside this JSX */}
      <style>
        {`
        /* Navbar styles */
        .brand-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 30px;
          color: #6a1b9a;
          padding-left: 20px;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-block;
          padding: 10px;
        }

        /* Mobile navigation styles */
        .navigation {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Menu button styles for mobile */
        #menu-btn {
          display: block;
          font-size: 30px;
          cursor: pointer;
          color: #6a1b9a;
        }

        /* Active state for mobile menu */
        .navigation ul.active {
          display: block;
        }

        /* Mobile navigation styling */
        .navigation ul {
          list-style-type: none;
          padding: 0;
          display: flex;
          gap: 20px;
        }

        /* Menu link styles */
        .navigation a {
          text-decoration: none;
          color: #6a1b9a;
        }

        /* Hover effect for menu links */
        .navigation a:hover {
          color: white;
          background-color: #6a1b9a;
          padding: 10px;
          border-radius: 5px;
        }

        /* Styling for mobile menu */
        .menu-dash {
          font-size: 30px;
          cursor: pointer;
          color: #6a1b9a;
        }

        /* Close button for mobile menu */
        #menu-close {
          color: #6a1b9a;
          font-size: 30px;
          cursor: pointer;
          display: none;
        }

        /* Sign Out button */
        .sign-out-button {
          background-color: #6a1b9a;
          color: white;
          padding: 8px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        /* Styling for button when hovering */
        .sign-out-button:hover {
          background-color: #4a148c;
        }

        /* Mobile responsive for smaller screens */
        @media (max-width: 768px) {
          .navigation ul {
            display: none;
            flex-direction: column;
          }

          .navigation ul.active {
            display: block;
          }

          .navigation a {
            padding: 15px;
            font-size: 18px;
          }

          #menu-close {
            display: block;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Navbar;
