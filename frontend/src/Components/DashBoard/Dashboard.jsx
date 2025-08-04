import React, { useState, useEffect } from 'react';
import './dstyle.css';
import SideBar from './SideBar';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setUsersCount(data.length));

    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) => setCoursesCount(data.length));

    fetch("http://localhost:8080/api/learning")
      .then((res) => res.json())
      .then((data) => setEnrolledCount(data.length));
  }, []);

  return (
    <div style={{ backgroundColor: "#eee", minHeight: "100vh" }}>
      <SideBar current={"dashboard"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="head-title">
            <div className="left">
              <h1 id="dashboard" style={{ color: 'darkblue' }}>Dashboard</h1>
            </div>
          </div>
          <ul className="box-info">
            <li onClick={() => navigate('/Dusers')} style={{ cursor: 'pointer' }}>
              <i className='bx bxs-group' id="i"></i>
              <span className="text">
                <h3>{usersCount}</h3>
                <p>Total Users</p>
              </span>
            </li>
            <li onClick={() => navigate('/DCourses')} style={{ cursor: 'pointer' }}>
              <i className='bx bx-book' id="i"></i>
              <span className="text">
                <h3>{coursesCount}</h3>
                <p>Total Courses</p>
              </span>
            </li>
            <li>
              <i className='bx bxs-calendar-check' id="i"></i>
              <span className="text">
                <h3>{enrolledCount}</h3>
                <p>Total Enrollments</p>
              </span>
            </li>
            <li onClick={() => navigate('/admin-feedback')} style={{ cursor: 'pointer' }}>
              <i className='bx bx-message-square-dots' id="i"></i>
              <span className="text">
                <h3>View</h3>
                <p>Feedback</p>
              </span>
            </li>
            <li onClick={() => navigate('/enroll-users')} style={{ cursor: 'pointer' }}>
              <i className='bx bx-list-check' id="i"></i>
              <span className="text">
                <h3>View</h3>
                <p>Enrollment Details</p>
              </span>
            </li>

          
            <li onClick={() => navigate('/admin-payments')} style={{ cursor: 'pointer' }}>
              <i className='bx bx-credit-card' id="i"></i>
              <span className="text">
                <h3>View</h3>
                <p>Payment Details</p>
              </span>
            </li>
          </ul>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;
