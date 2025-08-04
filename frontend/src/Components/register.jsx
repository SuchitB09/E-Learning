import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phno: "",
    password: "",
    dob: "",
    gender: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(value)) {
        setNameError("Name should contain only letters and spaces.");
      } else {
        setNameError("");
      }
    }

    if (name === "phno") {
      const cleanedValue = value.replace(/\D/g, "");
      if (!/^[6-9]\d{9}$/.test(cleanedValue)) {
        setPhoneError("Phone number must be 10 digits and start with 6-9.");
      } else {
        setPhoneError("");
      }
      setFormData({ ...formData, [name]: cleanedValue });
      return;
    }

    if (name === "email") {
      setEmailError(""); // reset on change
    }

    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,12}$/;
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Password must be 8–12 characters and include '@', letters, and numbers."
        );
      } else {
        setPasswordError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const isValidDOB = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    if (age > 10) return true;
    if (age === 10) {
      if (monthDiff > 0) return true;
      if (monthDiff === 0 && dayDiff >= 0) return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setGenderError("");
    setPasswordError("");
    setNameError("");
    setEmailError("");
    setPhoneError("");

    // Validation
    if (!/^[A-Za-z\s]+$/.test(formData.username)) {
      setNameError("Name should contain only letters and spaces.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phno)) {
      setPhoneError("Phone number must be 10 digits and start with 6-9.");
      return;
    }

    if (!isValidDOB(formData.dob)) {
      setError("You must be at least 10 years old.");
      return;
    }

    if (!formData.gender) {
      setGenderError("Please select your gender.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,12}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must be 8–12 characters and include '@', letters, and numbers."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Check for duplicate email error
      if (response.status === 409) {
        setEmailError("This email is already registered. Please use another.");
        return;
      }

      if (response.ok) {
        setSuccessMessage("User successfully registered! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Registration failed. Please try again later.");
    }
  };

  const inputStyle = (hasError) => ({
    border: hasError ? "2px solid red" : "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    width: "100%",
    fontSize: "15px",
    outline: "none",
  });

  const errorTextStyle = {
    color: "red",
    fontSize: "13px",
    marginTop: "5px",
  };

  const successTextStyle = {
    color: "green",
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px",
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "transparent",
            borderRadius: "12px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#007bff",
              marginBottom: "20px",
            }}
          >
            Registration Form
          </h2>

          {successMessage && <div style={successTextStyle}>{successMessage}</div>}

          <form
            onSubmit={handleSubmit}
            className="registration-form"
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="username"
                style={inputStyle(!!nameError)}
                value={formData.username}
                onChange={handleChange}
                required
              />
              {nameError && <div style={errorTextStyle}>{nameError}</div>}
            </div>

            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                style={inputStyle(!!emailError)}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {emailError && <div style={errorTextStyle}>{emailError}</div>}
            </div>

            <div>
              <label>Phone No:</label>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span>+91</span>
                <input
                  type="tel"
                  name="phno"
                  maxLength={10}
                  style={inputStyle(!!phoneError)}
                  value={formData.phno}
                  onChange={handleChange}
                  required
                />
              </div>
              {phoneError && <div style={errorTextStyle}>{phoneError}</div>}
            </div>

            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                style={inputStyle(!!passwordError)}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordError && <div style={errorTextStyle}>{passwordError}</div>}
            </div>

            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                style={inputStyle(false)}
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                style={inputStyle(!!genderError)}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {genderError && <div style={errorTextStyle}>{genderError}</div>}
            </div>

            <div>
              <label>Profession:</label>
              <select
                name="profession"
                value={formData.profession}
                style={inputStyle(false)}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Profession --</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Worker">Worker</option>
              </select>
            </div>

            {error && (
              <div style={{ ...errorTextStyle, textAlign: "center" }}>
                {error}
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                style={{
                  padding: "12px 25px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Register
              </button>
            </div>
          </form>

          <div style={{ textAlign: "center", fontSize: "14px", marginTop: "10px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#007bff" }}>
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
