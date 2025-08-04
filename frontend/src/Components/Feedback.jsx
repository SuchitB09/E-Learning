import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminFeedback = ({ courseid = 1 }) => {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const wordCount = (text) => text.trim().split(/\s+/).length;

  const sendFeedback = () => {
    if (!name.trim() || !courseName.trim() || !feedback.trim()) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 2000,
      });
    } else if (wordCount(feedback) < 5) {
      toast.error("Feedback must be at least 5 words.", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      fetch("http://localhost:8080/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: `From ${name} about ${courseName}: ${feedback}`,
          course_id: courseid,
        }),
      })
        .then((response) => {
          if (response.ok) {
            setFeedback("");
            setName("");
            setCourseName("");
            toast.success("Feedback submitted!", {
              position: "top-right",
              autoClose: 2000,
            });
            setShowModal(true);
          } else {
            toast.error("Failed to submit feedback.", {
              position: "top-right",
              autoClose: 2000,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error submitting feedback.", {
            position: "top-right",
            autoClose: 2000,
          });
        });
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>📝 Submit Your Feedback</h2>


        <label style={styles.label}>Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          placeholder="Enter your name"
        />

        <label style={styles.label}>Course Name</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          style={styles.input}
          placeholder="Enter course name"
        />

        

        <label style={styles.label}>Your Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={styles.textarea}
          rows="4"
          placeholder="Write at least 5 words of feedback..."
        />

        <button onClick={sendFeedback} style={styles.submitBtn}>
          🚀 Submit Feedback
        </button>
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>🎉 Thank you!</h3>
            <p>Your feedback has been successfully submitted.</p>
            <button onClick={closeModal} style={styles.closeModalBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #ece9e6, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  formContainer: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "25px",
    color: "#4a00e0",
  },
  label: {
    fontWeight: "600",
    marginBottom: "8px",
    display: "block",
    color: "#333",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    resize: "vertical",
    marginBottom: "20px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6a0dad",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    maxWidth: "400px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
  },
  closeModalBtn: {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#6a0dad",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default AdminFeedback;
