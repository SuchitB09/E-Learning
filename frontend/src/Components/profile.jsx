import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ImgUpload from "./ImgUpload";
import Performance from "./DashBoard/Performance";

function Profile() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }

    async function fetchUserDetails() {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user details.");
        const data = await response.json();
        setUserDetails(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUserDetails();
  }, [authToken, navigate, id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        localStorage.setItem("profileImage", imageData);
        setProfileImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile.");
      const updatedUser = await response.json();
      setUserDetails(updatedUser);
      setEditMode(false);
      setUpdateMessage("✅ Profile updated successfully!");
      setTimeout(() => setUpdateMessage(""), 3000); // hide after 3s
    } catch (error) {
      console.error("Update error:", error);
      setUpdateMessage("❌ Failed to update profile.");
    }
  };

  return (
    <div>
      <Navbar page={"profile"} />
      <div style={styles.card}>
        <div style={styles.centered}>
          <ImgUpload onChange={handleImageChange} src={profileImage} />
        </div>

        <div style={styles.formGrid}>
          {renderField("Name", "username")}
          {renderField("Email", "email")}
          {renderField("Phone Number", "phno")}
          {renderField("Gender", "gender")}
          {renderField("Date of Birth", "dob", "date")}
          {renderField("Profession", "profession")}
        </div>

        <div style={{ ...styles.field, marginTop: 20 }}>
          <label style={styles.label}>Learning Courses:</label>
          <p style={styles.value}>{userDetails?.learningCourses?.length || 0}</p>
        </div>

        {updateMessage && <div style={styles.successMessage}>{updateMessage}</div>}

        <div style={styles.buttonRow}>
          {!editMode ? (
            <button style={{ ...styles.button, ...styles.edit }} onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button style={{ ...styles.button, ...styles.save }} onClick={handleUpdateProfile}>
                Save Changes
              </button>
              <button
                style={{ ...styles.button, ...styles.cancel }}
                onClick={() => {
                  setEditMode(false);
                  setFormData(userDetails);
                  setUpdateMessage("");
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      <Performance />
    </div>
  );

  function renderField(label, fieldName, type = "text") {
    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}:</label>
        {editMode ? (
          <input
            type={type}
            name={fieldName}
            value={formData[fieldName] || ""}
            onChange={handleInputChange}
            style={styles.input}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <p style={styles.value}>{userDetails?.[fieldName]}</p>
        )}
      </div>
    );
  }
}

const styles = {
  card: {
    maxWidth: "600px",
    margin: "3% auto",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px 30px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },
  value: {
    fontSize: "15px",
    color: "#444",
    minHeight: "36px",
    padding: "6px 8px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
  },
  input: {
    padding: "10px",
    fontSize: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    transition: "border-color 0.3s",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "30px",
  },
  button: {
    padding: "12px 28px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    width: "140px",
    transition: "background-color 0.3s",
  },
  edit: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  save: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  cancel: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  successMessage: {
    backgroundColor: "#e6ffed",
    color: "#2e7d32",
    border: "1px solid #b2dfdb",
    padding: "12px",
    borderRadius: "6px",
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "15px",
  },
};

export default Profile;
