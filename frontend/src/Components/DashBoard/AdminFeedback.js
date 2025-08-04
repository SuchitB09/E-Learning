import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const parseComment = (comment = "") => {
  const match = comment.match(/^From (.+?) about (.+?): (.+)$/);
  if (match) {
    return {
      name: match[1],
      courseName: match[2],
      feedback: match[3],
    };
  }
  return {
    name: "N/A",
    courseName: "N/A",
    feedback: comment,
  };
};

const AdminFeedback = ({ courseid = 1 }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [deletedFeedbackIds, setDeletedFeedbackIds] = useState(new Set());
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/feedbacks/${courseid}`)
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching feedbacks:", error));
  }, [courseid]);

  const deleteFeedback = (feedbackId) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
    setDeletedFeedbackIds((prev) => new Set(prev.add(feedbackId)));

    fetch(`http://localhost:8080/api/feedbacks/${feedbackId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Feedback deleted!", {
            position: "top-right",
            autoClose: 2000,
          });
        } else {
          toast.error("Failed to delete feedback", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting feedback:", error);
        toast.error("Error deleting feedback", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const viewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const closeCard = () => {
    setSelectedFeedback(null);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📋 Course Feedback Table</h2>

        {feedbacks.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Comment</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map(
                  (item, index) =>
                    !deletedFeedbackIds.has(item.id) && (
                      <tr key={item.id} style={styles.tr}>
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>{item.comment}</td>
                        <td style={styles.td}>
                          <button
                            style={{ ...styles.actionBtn, ...styles.viewBtn }}
                            onClick={() => viewFeedback(item)}
                          >
                            👁️ View
                          </button>
                          <button
                            style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                            onClick={() => deleteFeedback(item.id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={styles.noData}>No feedback available yet.</p>
        )}
      </div>

      {selectedFeedback && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button onClick={closeCard} style={styles.closeBtn}>
              ✖
            </button>
            <h3 style={styles.modalTitle}>📄 Feedback Details</h3>
            <hr style={styles.divider} />
            {(() => {
              const { name, courseName, feedback } = parseComment(
                selectedFeedback.comment
              );
              return (
                <div style={styles.infoBlock}>
                  <p style={styles.modalLabel}>
                    <strong>👤 Name:</strong>
                    <br />
                    {name}
                  </p>
                  <p style={styles.modalLabel}>
                    <strong>📘 Course Name:</strong>
                    <br />
                    {courseName}
                  </p>
                  <p style={styles.modalLabel}>
                    <strong>💬 Feedback:</strong>
                    <br />
                    <em style={{ color: "#555" }}>{feedback}</em>
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
    padding: "50px 20px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    width: "100%",
    maxWidth: "1000px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#343a40",
    textAlign: "center",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    fontSize: "15px",
  },
  thead: {
    backgroundColor: "#4a00e0",
    color: "#fff",
  },
  th: {
    textAlign: "left",
    padding: "14px 20px",
    color: "#fff",
    fontWeight: 600,
  },
  tr: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease",
  },
  td: {
    padding: "14px 20px",
    borderTop: "1px solid #eee",
    verticalAlign: "top",
    color: "#495057",
  },
  actionBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    marginRight: "8px",
    transition: "background 0.3s",
  },
  viewBtn: {
    backgroundColor: "#5e72e4",
    color: "#fff",
  },
  deleteBtn: {
    backgroundColor: "#f5365c",
    color: "#fff",
  },
  noData: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: "20px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "20px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#4a00e0",
    marginBottom: "15px",
    textAlign: "center",
  },
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#ccc",
    margin: "10px 0 20px",
  },
  modalLabel: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  infoBlock: {
    padding: "0 10px",
  },
};

export default AdminFeedback;
