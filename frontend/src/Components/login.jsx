import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import Navbar from "./Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Added password validation error
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const login = async (e) => {
    e.preventDefault();

    // Check if email or password is empty
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // Validate password if needed
    if (passwordError) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);

        // Fetch user details after successful login
        const userDetailsResponse = await fetch(
          `http://localhost:8080/api/users/details?email=${email}`
        );

        if (userDetailsResponse.ok) {
          const ud = await userDetailsResponse.json();
          localStorage.setItem("name", ud.username);
          localStorage.setItem("id", ud.id);
          setUser({ name: ud.username, email, id: ud.id });
          navigate("/courses");
        } else {
          setError("An error occurred while fetching user details.");
        }
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred during login");
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth">
        <div className="container">
          <h3>Welcome!</h3>
          <br />
          <h2>Login</h2>
          <br />
          <form autoComplete="off" className="form-group" onSubmit={login}>
            <label htmlFor="email">Email Id :</label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%", marginRight: "50px" }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <br />
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                const isValid = /^(?=.*[0-9])(?=.*[@#$%^&*!])[A-Za-z0-9@#$%^&*!]{8,12}$/.test(value);
                if (!isValid) {
                  setPasswordError("Password must be 8-12 characters and include a number and special symbol.");
                } else {
                  setPasswordError("");
                }
              }}
              value={password}
              required
            />
            {passwordError && (
              <div style={{ color: "red" }}>{passwordError}</div>
            )}
            <br />
            <div className="btn1">
              <button type="submit" className="btn btn-success btn-md mybtn">
                LOGIN
              </button>
            </div>
          </form>
          {error && <span className="error-msg" style={{ color: "red" }}>{error}</span>}
          <br />
          <span>
            Don't have an account? Register
            <Link to="/register"> Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
