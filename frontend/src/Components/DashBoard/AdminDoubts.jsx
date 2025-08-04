import React, { useState, useEffect } from 'react';
import './dstyle.css'; // Ensure you have the appropriate styles in your dstyle.css file
import SideBar from './SideBar';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

function AdminDoubts() {
  const [doubts, setDoubts] = useState([]);
  const location = useLocation();
  const courseId = location.pathname.split("/")[2]; // Assuming you're passing the course ID in the URL

  useEffect(() => {
    fetch(`http://localhost:8080/api/discussions/${courseId}`)
      .then((res) => res.json())
      .then((data) => setDoubts(data));
  }, [courseId]);

  const deleteDoubt = (doubtId) => {
    fetch(`http://localhost:8080/api/discussions/deleteMessage/${doubtId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setDoubts((prevDoubts) => prevDoubts.filter((doubt) => doubt.id !== doubtId));
      })
      .catch((error) => {
        console.error("Failed to delete doubt:", error);
      });
  };

  return (
    <div style={{ backgroundColor: "#eee", minHeight: "100vh" }}>
      <SideBar current={"admin-doubts"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="head-title">
            <div className="left">
              <h1 id="admin-doubts" style={{ color: 'darkblue' }}>Student Doubts</h1>
            </div>
          </div>

          <ul className="box-info">
            {doubts.length > 0 ? (
              doubts.map((doubt) => (
                <li key={doubt.id} className="doubt-item">
                  <div className="doubt-info">
                    <span className="doubt-user">
                      <strong>{doubt.uName}</strong> ({doubt.email})
                    </span>
                    <p className="doubt-content">{doubt.content}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteDoubt(doubt.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No doubts yet.</p>
            )}
          </ul>
        </main>
      </section>
    </div>
  );
}

export default AdminDoubts;
