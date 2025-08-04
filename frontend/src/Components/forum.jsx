import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Forum() {
  const taskRef = useRef("");
  const [message, setMessage] = useState([]);
  const [name] = useState(localStorage.getItem("name"));
  const [course, setCourse] = useState();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];

  const [formData, setFormData] = useState({
    name: name,
    course_id: courseId,
    content: ''
  });

  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/discussions/${courseId}`)
      .then((res) => res.json())
      .then((data) => setMessage(data));

    fetch(`http://localhost:8080/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourse(data));
  }, [courseId]);

  const addTask = () => {
    if (taskRef.current && taskRef.current.value.trim() !== "") {
      const newMessage = taskRef.current.value.trim();

      const wordCount = newMessage.split(/\s+/).length;
      if (wordCount < 10) {
        alert("Note must be at least 10 words long!");
        return;
      }

      const messageToSend = { 
        ...formData, 
        content: newMessage
      };

      fetch('http://localhost:8080/api/discussions/addMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageToSend),
      }).then(() => {
        taskRef.current.value = "";
        setFormData({ ...formData, content: "" });

        fetch(`http://localhost:8080/api/discussions/${courseId}`)
          .then((res) => res.json())
          .then((data) => setMessage(data));

        setPopupMessage("Note saved successfully!");
        setTimeout(() => setPopupMessage(""), 3000);
      }).catch(() => {
        setPopupMessage("Failed to save note. Please try again.");
        setTimeout(() => setPopupMessage(""), 3000);
      });
    } else {
      alert("Enter a Message");
    }
  };

  const deleteMessage = (messageId) => {
    setMessage((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );

    fetch(`http://localhost:8080/api/discussions/deleteMessage/${messageId}`, {
      method: 'DELETE',
    }).catch((error) => {
      console.error("Failed to delete message:", error);
    });
  };

  return (
    <div className="Forum" style={styles.forum}>
      <h2 style={styles.forumTitle}>Your Notes for {course?.course_name}</h2>

      {popupMessage && (
        <div style={styles.popup}>
          <p>{popupMessage}</p>
        </div>
      )}

      <div style={styles.inputContainer}>
        <textarea
          cols="30"
          rows="5"
          type="text"
          ref={taskRef}
          name="taskInput"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your note here..."
          style={styles.messageInput}
        />
      </div>

      <div style={styles.sendButtonContainer}>
        <button onClick={addTask} style={styles.sendButton}>Save Note</button>
      </div>

      {message.length > 0 && (
        <div style={styles.taskContainer}>
          {message.map((value) => (
            value.content.trim() && (
              <div style={styles.taskItem} key={value.id}>
                <p>
                  <span style={styles.userName}>
                    {value.uName}
                    <span style={styles.userEmail}> ({value.email})</span>
                  </span>
                  <span style={styles.messageContent}>{value.content}</span>
                </p>
                <button
                  onClick={() => deleteMessage(value.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  forum: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f9fc',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  forumTitle: {
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2rem',
    fontWeight: '600',
    letterSpacing: '1px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '700px', // Increased max width
  },
  messageInput: {
    width: '100%',
    minHeight: '150px', // Increased height
    padding: '20px', // Increased padding
    borderRadius: '12px', // Rounded corners
    border: '1px solid #ddd',
    fontSize: '16px',
    resize: 'none',
    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.1)', // Subtle shadow
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  messageInputFocus: {
    borderColor: '#6c63ff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Focus effect
  },
  sendButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
    width: '100%',
    maxWidth: '700px', // Matched with input width
  },
  sendButton: {
    backgroundColor: '#6c63ff',
    color: 'white',
    padding: '15px 25px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.3s',
  },
  sendButtonHover: {
    backgroundColor: '#4a44d1',
  },
  taskContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    width: '100%',
    maxWidth: '700px', // Matched with input width
  },
  taskItem: {
    backgroundColor: '#fff',
    width: '100%',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    transition: 'box-shadow 0.3s',
  },
  taskItemHover: {
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#6c63ff',
    display: 'inline-block',
    marginRight: '10px',
    backgroundColor: '#f1f1f1',
    padding: '4px 8px',
    borderRadius: '8px',
  },
  userEmail: {
    fontSize: '14px',
    color: '#ff5722',
    fontStyle: 'italic',
    marginLeft: '10px',
  },
  messageContent: {
    fontSize: '16px',
    color: '#333',
    display: 'block',
    marginTop: '10px',
    lineHeight: '1.6',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '10px 15px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    outline: 'none',
    transition: 'background-color 0.3s',
  },
  deleteButtonHover: {
    backgroundColor: '#ff2d2d',
  },
  popup: {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: 1000,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
};

export default Forum;
