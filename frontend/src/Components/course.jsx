import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { Progress, Modal, Button } from "antd";
import Feedback from "./Feedback";
import styled from "styled-components"; // Correct import for styled-components

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const [course, setCourse] = useState({
    course_name: "",
    instructor: "",
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(null);
  const [played, setPlayed] = useState(0);
  const [changePlayed, setChangePlayed] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("id"));

  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${courseId}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleDuration = () => {
    setDuration(playerRef.current.getDuration());
    if (duration !== 0) {
      fetch("http://localhost:8080/api/progress/update-duration", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId, duration }),
      });
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/progress/${userId}/${courseId}`)
      .then((response) => response.json())
      .then((data) => setPlayed(data))
      .catch((error) => console.error("Error:", error));
  }, [userId, courseId]);

  useEffect(() => {
    const updateProgress = async () => {
      if (courseId && userId) {
        try {
          const response = await fetch("http://localhost:8080/api/progress/update-progress", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, courseId, playedTime: played, duration }),
          });

          if (response.ok) {
            setPlayed(changePlayed < played ? played : changePlayed);
          } else {
            console.error("Error updating progress:", response.statusText);
          }
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }
    };

    updateProgress();
  }, [changePlayed]);

  if (loading) {
    return <LoadingDiv>Loading...</LoadingDiv>;
  }

  if (error) {
    return <ErrorDiv>Something went wrong!</ErrorDiv>;
  }

  return (
    <CourseContainer>
      <Header>
        <h3>The Complete {course.course_name} Course - 2025</h3>
      </Header>

      <ContentWrapper>
        <VideoSection>
          <ReactPlayer
            ref={playerRef}
            onProgress={(Progress) => {
              if (changePlayed + 10 <= Progress.playedSeconds) {
                setChangePlayed(Progress.playedSeconds);
              }
            }}
            url={course.y_link}
            controls
            width="100%"
            height="440px"
            onDuration={handleDuration}
            played={played}
          />
        </VideoSection>

        <InfoSection>
          <h4>Course Format:</h4>
          <p>
            This is a self-paced online course, consisting of video lectures, hands-on coding exercises, and quizzes.
            You can complete the course at your own pace within the 8-week access period.
          </p>

          <h4>Prerequisites:</h4>
          <p>No prior programming experience is required, but basic computer literacy is recommended.</p>

          <h4>Who Should Take This Course:</h4>
          <ul>
            <li>Beginners interested in learning programming.</li>
            <li>Individuals looking to add {course.course_name} to their skillset.</li>
            <li>Students preparing for computer science courses.</li>
          </ul>

          <h4>Evaluate Yourself:</h4>
          <p>The assessments are designed to reinforce your learning and provide valuable feedback on your progress.</p>

          <QuizButtonSection>
            {Math.ceil((played / duration) * 100) >= 98 ? (
              <QuizButton onClick={() => navigate(`/assessment/${course.course_id}`)}>
                Take the Quiz
              </QuizButton>
            ) : (
              <QuizButtonDisabled onClick={showModal}>Take the Quiz (Locked)</QuizButtonDisabled>
            )}
          </QuizButtonSection>
        </InfoSection>
      </ContentWrapper>

      <DescriptionSection>
        <h4>Description:</h4>
        <p>{course.description}</p>

        <InstructorDetails>
          <h4>Instructor: {course.instructor}</h4>
          <h4>Content Type: Video</h4>
        </InstructorDetails>

        <ActionButtons>
         <button
  onClick={() => navigate("/learnings")}
  style={{
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    boxSizing: 'border-box'
  }}
>
  Go Back to Learnings
</button>
          <Modal title="Note:" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Complete 100% of your course to take the Quiz.</p>
          </Modal>
        </ActionButtons>
      </DescriptionSection>

      <ProgressReport>
        <h3>Progress:</h3>
        <StyledProgress
          percent={Math.ceil((played / duration) * 100)}
          status="active"
          strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
          showInfo={false}
        />

        <ReportDetails>
          <h3>Report:</h3>
          <p>
            You have completed <span>{Math.ceil((played / duration) * 100)}%</span> of this course.
          </p>
        </ReportDetails>
      </ProgressReport>

      <CreateNotesButton onClick={() => navigate(`/discussion/${courseId}`)}>
        Create Your Own Notes
      </CreateNotesButton>

      <Feedback courseid={courseId} />
    </CourseContainer>
  );
};

// Styled-components

const CourseContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f4f7fc;
  padding: 20px;
  margin: 0 auto;
`;

const Header = styled.div`
  background-color: darkblue;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  h3 {
    font-size: 2rem;
    font-style: italic;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const VideoSection = styled.div`
  width: 60%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const InfoSection = styled.div`
  width: 35%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const QuizButtonSection = styled.div`
  margin-top: 20px;
`;

const QuizButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  width: auto;
  max-width: 100%;
`;

const QuizButtonDisabled = styled.button`
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: not-allowed;
  font-size: 1rem;
  font-weight: bold;
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  width: auto;
  max-width: 100%;
`;

const DescriptionSection = styled.div`
  background-color: white;
  padding: 20px;
  margin-top: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const InstructorDetails = styled.div`
  margin-top: 20px;
`;

const ActionButtons = styled.div`
  margin-top: 20px;
`;

const BackButton = styled(Button)`
  background-color: #007bff;
  color: white;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
  white-space: normal;
  word-wrap: break-word;

  &:hover {
    background-color: #0056b3;
    box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4);
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }

  &:active {
    background-color: #004085;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transform: scale(0.98);
  }
`;

const ProgressReport = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const StyledProgress = styled(Progress)`
  width: 70%;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
`;

const ReportDetails = styled.div`
  margin-top: 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const CreateNotesButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  width: auto;
  max-width: 100%;
`;

const LoadingDiv = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: red;
  margin-top: 50px;
`;

const ErrorDiv = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: red;
  margin-top: 50px;
`;

export default Course;
