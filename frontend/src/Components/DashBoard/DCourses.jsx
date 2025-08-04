import React, { useState, useEffect } from "react";
import "./dstyle.css";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal, message } from "antd";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Failed to load courses.");
    }
  };

  const confirmDelete = (courseId) => {
    setSelectedCourseId(courseId);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCourseId) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8080/api/courses/${selectedCourseId}`
      );

      if (response.status === 204 || response.status === 200) {
        message.success("Course deleted successfully.");
        fetchCourses(); // Refresh list from backend
      } else {
        message.error("Failed to delete course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);

      // Check if backend error is likely due to enrollments
      const backendMessage = error?.response?.data?.message || "";
      const statusCode = error?.response?.status;

      if (
        statusCode === 500 ||
        statusCode === 409 ||
        backendMessage.toLowerCase().includes("students") ||
        backendMessage.toLowerCase().includes("enroll")
      ) {
        message.error("You cannot delete this course. There are too many people enrolled in it.");
      } else {
        message.error(backendMessage || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
      setOpenModal(false);
      setSelectedCourseId(null);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedCourseId(null);
  };

  const editCourse = (id) => navigate(`/editCourse/${id}`);
  const addQuestions = (id) => navigate(`/addquestions/${id}`);

  return (
    <>
      <SideBar current={"courses"} />
      <section id="content">
        <Navbar />
        <main className="t">
          <div className="table-data" style={{ marginTop: "-10px" }}>
            <div className="order">
              <div id="course" className="todo">
                <div className="head" style={{ marginTop: "-100px" }}>
                  <h3 style={{ color: "white" }}>Courses</h3>
                  <button
                    onClick={() => navigate("/addcourse")}
                    style={{
                      backgroundColor: "darkblue",
                      borderRadius: "10px",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Add Course <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <ul className="todo-list">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className="completed"
                      style={{
                        marginTop: "10px",
                        backgroundColor: "white",
                        color: "black",
                      }}
                    >
                      <p>{course.courseName}</p>
                      <div style={{ width: "50px", display: "flex" }}>
                        <button
                          onClick={() => confirmDelete(course.id)}
                          className="delete-button"
                          style={{ backgroundColor: "white", marginRight: "20px" }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          onClick={() => editCourse(course.id)}
                          className="edit-button"
                          style={{ backgroundColor: "white", marginRight: "20px" }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => addQuestions(course.id)}
                          style={{
                            backgroundColor: "#457BC1",
                            borderRadius: "10px",
                            color: "white",
                            border: "none",
                            padding: "8px",
                            fontWeight: "500",
                          }}
                        >
                          Test
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={openModal}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete this course?</p>
      </Modal>
    </>
  );
}

export default Courses;
