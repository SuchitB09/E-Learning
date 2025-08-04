import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Performance = () => {
  const [performanceData, setPerfomanceData] = useState([]);
  const [enrolledcourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const userId = localStorage.getItem('id');
        const response = await axios.get(`http://localhost:8080/api/learning/${userId}`);
        const fetchedCourse = response.data;
        setEnrolledCourses(fetchedCourse);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourse();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('id');
    fetch(`http://localhost:8080/api/assessments/perfomance/${userId}`)
      .then((res) => res.json())
      .then((data) => setPerfomanceData(data));
  }, []);

  function certifiedUser(id) {
    navigate(`/certificate/${id}`);
  }

  return (
    <div className="performance-container">
      <div className="enrolled-courses">
        <h2>Courses Enrolled</h2>
        <table className="performance-table">
          <thead>
            <tr>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {enrolledcourses.map((data, index) => (
              <tr key={index}>
                <td>{data.course_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="performance-section">
        <h2>Performance</h2>
        <table className="performance-table">
          <thead>
            <tr>
              <th>Courses</th>
              <th>Progress</th>
              <th>Marks</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((data, index) => (
              <tr key={index}>
                <td>{data.course.course_name}</td>
                <td className={data.marks !== 0 ? 'completed-status' : 'pending-status'}>
                  {data.marks !== 0 ? 'Completed' : 'Pending'}
                </td>
                <td>{data.marks}</td>
                <td
                  className={data.marks !== 0 ? 'completed-certificate' : 'pending-certificate'}
                  onClick={() => certifiedUser(data.course.id)}
                >
                  {data.marks !== 0 ? 'Download Certificate' : 'Not Available'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        /* Performance Component Styling */
        .performance-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px;
          background: linear-gradient(135deg, #f7f7f7, #e1e9f0);
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin-top: 70px;
        }

        .performance-container h2 {
          color: #2c3e50;
          font-size: 2rem;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .performance-container h2:hover {
          color: #2980b9;
          transition: color 0.3s ease;
        }

        .enrolled-courses, .performance-section {
          margin-bottom: 40px;
        }

        .performance-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .performance-table th, .performance-table td {
          padding: 15px 20px;
          text-align: left;
          border: 1px solid #f0f0f0;
          font-size: 1.1rem;
          transition: background-color 0.3s ease;
        }

        .performance-table th {
          background-color: #2c3e50;
          color: #fff;
          font-weight: 600;
        }

        .performance-table td {
          background-color: #fff;
          color: #333;
        }

        .performance-table tr {
          transition: background-color 0.3s ease;
        }

        .performance-table tr:hover {
          background-color: #f1f1f1;
          cursor: pointer;
        }

        .completed-status {
          color: #27ae60;
          font-weight: bold;
        }

        .pending-status {
          color: #e74c3c;
          font-weight: bold;
        }

        .completed-certificate {
          color: #2980b9;
          text-decoration: underline;
          cursor: pointer;
        }

        .pending-certificate {
          color: #bdc3c7;
        }

        .completed-certificate:hover {
          color: #1abc9c;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .pending-certificate:hover {
          cursor: not-allowed;
        }

        .performance-table td, .performance-table th {
          padding: 15px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .performance-container {
            padding: 15px;
          }

          .performance-table th, .performance-table td {
            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .performance-container {
            padding: 10px;
          }

          .performance-table {
            font-size: 0.95rem;
          }

          .performance-table th, .performance-table td {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default Performance;
