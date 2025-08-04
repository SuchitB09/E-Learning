import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, password } = credentials;

    if (name === "admin" && password === "Sahil@123") {
      navigate("/dashboard"); // redirects to dashboard
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#f2f2f2"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Admin Login</h2>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={credentials.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        {error && (
          <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <button type="submit" style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
