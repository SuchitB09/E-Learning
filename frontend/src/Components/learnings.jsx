import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Learnings() {
  const userId = localStorage.getItem("id");
  const [courses, setCourse] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(`http://localhost:8080/api/learning/${userId}`);
        const fetchedCourse = response.data;
        setCourse(fetchedCourse);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourse();
  }, [userId]);

  if (courses.length === 0) {
    return (
      <>
        <Navbar page="learnings" />
        <NoCoursesContainer>
          <h1>No Courses Enrolled Yet</h1>
          <p>Explore available courses and start learning today!</p>
          <ExploreButton onClick={() => navigate('/courses')}>Explore Courses</ExploreButton>
        </NoCoursesContainer>
      </>
    );
  }

  return (
    <>
      <Navbar page={"learnings"} />
      <CoursesContainer>
        {courses.map((course) => (
          <CourseCard key={course.id}>
            <CourseImage src={course.photo} alt={course.courseName} />
            <CourseDetails>
              <CourseTitle>{course.courseName}</CourseTitle>
              <CourseInstructor>by {course.instructor}</CourseInstructor>
              <Link to={`/course/${course.id}`} style={{ textDecoration: "none" }}>
                <CourseButton>Start Learning</CourseButton>
              </Link>
            </CourseDetails>
          </CourseCard>
        ))}
      </CoursesContainer>
    </>
  );
}

export default Learnings;

// Styled Components

const NoCoursesContainer = styled.div`
  text-align: center;
  margin-top: 10%;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(145deg, #f3f3f3, #c9c9c9);
  padding: 50px 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 36px;
    color: #333;
    margin-bottom: 20px;
  }

  p {
    color: #777;
    font-size: 18px;
    margin-bottom: 30px;
  }
`;

const ExploreButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #017bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const CoursesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
  padding: 0 20px;
  margin-bottom: 50px;
`;

const CourseCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const CourseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CourseDetails = styled.div`
  padding: 20px;
`;

const CourseTitle = styled.h3`
  font-size: 24px;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
`;

const CourseInstructor = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
`;

const CourseButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
