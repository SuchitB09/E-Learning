import React, { useEffect, useState } from 'react';
import './dstyle.css';
import SideBar from './SideBar';
import Navbar from './Navbar';

function Users() {
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((data) => data.json())
      .then((res) => setUsers(res))
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setErrorMessage("Failed to load users.");
      });
  }, []);

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
        setSuccessMessage("User deleted successfully!");
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        const msg = data?.message?.toLowerCase();

        if (msg && (msg.includes("enroll") || msg.includes("course"))) {
          setErrorMessage("User is already enrolled in a course and cannot be deleted.");
        } else {
          setErrorMessage("User is already enrolled in a course and cannot be deleted");
        }

        setSuccessMessage('');
        setTimeout(() => setErrorMessage(''), 4000);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage("Server error. Please try again later.");
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  return (
    <div style={{ backgroundColor: "#eee", minHeight: "100vh" }}>
      <SideBar current={"user"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="table-data" style={{ marginTop: "-10px" }}>
            <div className="order">
              <div className="head">
                <h3>Users Info</h3>
                {successMessage && (
                  <div style={styles.successMsg}>{successMessage}</div>
                )}
                {errorMessage && (
                  <div style={styles.errorMsg}>{errorMessage}</div>
                )}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone Number</th>
                    <th style={styles.th}>Profession</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={styles.td}>{user.username}</td>
                      <td style={styles.tdCenter}>{user.email}</td>
                      <td style={styles.tdCenter}>{user.phno}</td>
                      <td style={styles.tdCenter}>{user.profession}</td>
                      <td style={styles.tdCenter}>
                        <button style={styles.viewBtn} onClick={() => setSelectedUser(user)}>
                          View
                        </button>
                        <button style={styles.deleteBtn} onClick={() => deleteUser(user.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedUser && (
                <div style={styles.userCard}>
                  <div style={styles.cardHeader}>
                    <h3>User Details</h3>
                    <button style={styles.closeBtn} onClick={() => setSelectedUser(null)}>Close</button>
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.cardItem}>
                      <strong>Username:</strong>
                      <span>{selectedUser.username}</span>
                    </div>
                    <div style={styles.cardItem}>
                      <strong>Email:</strong>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div style={styles.cardItem}>
                      <strong>Phone Number:</strong>
                      <span>{selectedUser.phno}</span>
                    </div>
                    <div style={styles.cardItem}>
                      <strong>Profession:</strong>
                      <span>{selectedUser.profession}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

const styles = {
  th: {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    textAlign: 'start',
    borderBottom: '1px solid #ddd',
  },
  tdCenter: {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
  },
  viewBtn: {
    padding: '5px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    marginRight: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '5px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  successMsg: {
    marginTop: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMsg: {
    marginTop: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userCard: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '320px',
    margin: 'auto',
    textAlign: 'left',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  closeBtn: {
    padding: '6px 14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  cardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#555',
  },
};

export default Users;
