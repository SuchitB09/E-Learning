import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const EnrollUsers = () => {
  const [users, setUsers] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [mostEnrolledCourse, setMostEnrolledCourse] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  async function fetchUsersAndCourses() {
    try {
      const usersResponse = await axios.get("http://localhost:8080/api/users");
      const allUsers = usersResponse.data;
      setUsers(allUsers);

      const coursesPromises = allUsers.map(async (user) => {
        const coursesRes = await axios.get(`http://localhost:8080/api/learning/${user.id}`);
        const courses = coursesRes.data;

        let performance = [];
        try {
          const perfRes = await axios.get(`http://localhost:8080/api/assessments/perfomance/${user.id}`);
          performance = perfRes.data;
        } catch (err) {
          console.warn(`No performance data for user ${user.id}`);
        }

        const mergedCourses = courses.map((course) => {
          const perf = performance.find((p) => p.course.id === course.id);
          return {
            ...course,
            marks: perf ? perf.marks : 0,
          };
        });

        return { userId: user.id, courses: mergedCourses };
      });

      const coursesResults = await Promise.all(coursesPromises);
      const map = {};
      const courseFrequency = {};

      coursesResults.forEach(({ userId, courses }) => {
        map[userId] = courses;
        courses.forEach((course) => {
          courseFrequency[course.course_name] = (courseFrequency[course.course_name] || 0) + 1;
        });
      });

      setCoursesMap(map);

      const mostEnrolled = Object.entries(courseFrequency).sort((a, b) => b[1] - a[1])[0];
      if (mostEnrolled) {
        setMostEnrolledCourse({ name: mostEnrolled[0], count: mostEnrolled[1] });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching users or courses:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsersAndCourses();
    const interval = setInterval(fetchUsersAndCourses, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleDetails = (userId) => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };

  if (loading) {
    return <div style={styles.loading}>Loading users and courses...</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>All Users and Their Enrolled Courses</h2>

        {/* Most Enrolled Course */}
        {mostEnrolledCourse && (
          <div style={styles.mostEnrolledCard}>
            <div style={styles.courseIcon}>🎓</div>
            <div>
              <span style={styles.mostEnrolledLabel}>Most Enrolled Course</span>
              <h3 style={styles.mostEnrolledName}>{mostEnrolledCourse.name}</h3>
              <span style={styles.mostEnrolledCount}>{mostEnrolledCourse.count} users enrolled</span>
            </div>
          </div>
        )}

        {/* Search bar with icon */}
        <div style={styles.searchWrapper}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={styles.searchIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
          <input
            type="text"
            placeholder="Search by Email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            style={{
              ...styles.searchInput,
              ...(isSearchFocused ? styles.searchInputFocus : {}),
            }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone Number</th>
              <th style={styles.th}>Profession</th>
              <th style={styles.th}>Enrolled Courses</th>
              <th style={styles.th}>Payment Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
              )
              .map((user, idx) => {
                const courses = coursesMap[user.id] || [];
                const isHovered = hoveredRow === user.id;
                const paymentStatus = courses.length > 0 ? "Success" : "Pending";
                const isSelected = selectedUserId === user.id;

                return (
                  <React.Fragment key={user.id}>
                    <tr
                      style={{
                        ...styles.tr,
                        backgroundColor: isHovered
                          ? "#dbeeff"
                          : idx % 2 === 0
                          ? "#f9f9f9"
                          : "#ffffff",
                      }}
                      onMouseEnter={() => setHoveredRow(user.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <FaUserCircle size={20} color="#007BFF" style={{ marginRight: 8 }} />
                        {user.username}
                      </td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>{user.phno}</td>
                      <td style={styles.td}>{user.profession}</td>
                      <td style={styles.td}>
                        {courses.length > 0 ? courses.map((c) => c.course_name).join(", ") : "None"}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          color: paymentStatus === "Success" ? "green" : "red",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        {paymentStatus}
                      </td>
                      <td style={styles.td}>
                        <button style={styles.viewButton} onClick={() => toggleDetails(user.id)}>
                          {isSelected ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>
                    {isSelected && (
                      <tr>
                        <td colSpan={7} style={styles.detailCard}>
                          <h4>Enrolled Courses Detail & Performance</h4>
                          {courses.length === 0 ? (
                            <p>No enrolled courses available.</p>
                          ) : (
                            <table style={styles.innerTable}>
                              <thead>
                                <tr>
                                  <th style={styles.innerTh}>Course Name</th>
                                  <th style={styles.innerTh}>Marks</th>
                                  <th style={styles.innerTh}>Exam Attempt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {courses.map((course, i) => (
                                  <tr key={i}>
                                    <td style={styles.innerTd}>{course.course_name}</td>
                                    <td
                                      style={{
                                        ...styles.innerTd,
                                        color: course.marks > 0 ? "#27ae60" : "#e74c3c",
                                        fontWeight: "700",
                                      }}
                                    >
                                      {course.marks || 0}
                                    </td>
                                    <td
                                      style={{
                                        ...styles.innerTd,
                                        color: course.marks > 0 ? "#27ae60" : "#e74c3c",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {course.marks > 0 ? "Attempted" : "Not Attempted"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            style={styles.backButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
            onClick={() => (window.location.href = "http://localhost:3000/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Inline style tag for bounce animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #6b8dd6 0%, #b3c7f9 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "95%",
    maxWidth: "1400px",
    backgroundColor: "#ffffff",
    padding: "40px 50px",
    borderRadius: "20px",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15)",
    overflowX: "auto",
  },
  title: {
    marginBottom: "20px",
    fontWeight: "700",
    fontSize: "36px",
    color: "#222",
    textAlign: "center",
  },

  // New Most Enrolled Course Styles
  mostEnrolledCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e0f0ff",
    borderRadius: "16px",
    padding: "20px 30px",
    boxShadow: "0 10px 30px rgba(0, 123, 255, 0.2)",
    maxWidth: "450px",
    margin: "0 auto 30px auto",
    cursor: "default",
    transition: "transform 0.3s ease",
  },
  courseIcon: {
    fontSize: "48px",
    marginRight: "20px",
    animation: "bounce 2s infinite",
  },
  mostEnrolledLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#007bff",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "6px",
    display: "block",
  },
  mostEnrolledName: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#004080",
  },
  mostEnrolledCount: {
    fontSize: "16px",
    color: "#0059b3",
    fontWeight: "600",
    marginTop: "6px",
    display: "block",
  },

  // Search bar and icon styles
  searchWrapper: {
    position: "relative",
    width: "320px",
    margin: "0 auto 25px auto",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    color: "#007BFF",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "10px 40px 10px 36px",
    fontSize: "16px",
    borderRadius: "25px",
    border: "2px solid #007BFF",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box",
  },
  searchInputFocus: {
    borderColor: "#0056b3",
    boxShadow: "0 0 8px rgba(0, 123, 255, 0.5)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "18px",
    color: "#333",
  },
  th: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "16px 20px",
    textAlign: "left",
    fontWeight: "700",
    letterSpacing: "0.05em",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  tr: {
    transition: "background-color 0.3s ease",
  },
  td: {
    padding: "16px 20px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "middle",
  },
  viewButton: {
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "background-color 0.3s ease",
  },
  detailCard: {
    backgroundColor: "#f1f8ff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,123,255,0.2)",
  },
  innerTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
  },
  innerTh: {
    backgroundColor: "#2980b9",
    color: "white",
    padding: "14px 20px",
    fontWeight: "700",
  },
  innerTd: {
    padding: "14px 20px",
    borderBottom: "1px solid #ddd",
  },
  backButton: {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "18px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "background-color 0.3s ease",
  },
  loading: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 50,
    color: "#555",
  },
};

export default EnrollUsers;
