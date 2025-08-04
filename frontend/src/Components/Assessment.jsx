import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faBackward, faFaceSadTear, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'antd';
import axios from 'axios';

function YourComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.pathname.split("/")[2];
  const [test, setTest] = useState([]);
  const [userId] = useState(localStorage.getItem("id"));
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [totalQsns, setTotalQsns] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [focusLostCount, setFocusLostCount] = useState(0);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/questions/${courseId}`)
      .then(res => res.json())
      .then(res => {
        setTest(res);
        setTotalQsns(res.length);
        setSelectedAnswers(new Array(res.length).fill(null));
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [courseId]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (started && timeLeft === 0) {
      autoSubmitQuiz();
    }

    return () => clearInterval(timerRef.current);
  }, [started, timeLeft]);

  useEffect(() => {
    if (focusLostCount > 2 && started && timeLeft > 0) {
      alert("You have switched tabs or lost focus more than 3 times. The quiz will be auto-submitted.");
      autoSubmitQuiz();
    }
  }, [focusLostCount]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && started) {
        setTabSwitchWarning(true);
        setFocusLostCount(prev => prev + 1);
      }
    };

    const handleBlur = () => {
      if (started) {
        setTabSwitchWarning(true);
        setFocusLostCount(prev => prev + 1);
      }
    };

    const handleContextMenu = (e) => e.preventDefault();
    const handleBeforeUnload = (e) => {
      if (started) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [started]);

  const autoSubmitQuiz = () => {
    clearInterval(timerRef.current);
    handleMarks();
    stopCamera();
    setOpenModal(true);
    setLoadingRedirect(true);
    setTimeout(() => navigate("/profile"), 3000);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStartQuiz = async () => {
    if (test.length === 0 || !agreedToRules) return;
    setStarted(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Webcam access is required to start the quiz.");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleCheckboxChange = (questionIndex, selectedOption) => {
    if (!started || timeLeft <= 0) return;

    const updatedAnswers = [...selectedAnswers];
    const qsn = test[questionIndex];
    const alreadyCorrect = updatedAnswers[questionIndex] === qsn.answer;

    updatedAnswers[questionIndex] = selectedOption;
    const nowCorrect = selectedOption === qsn.answer;

    if (!alreadyCorrect && nowCorrect) {
      setCorrectCount(prev => prev + 1);
    } else if (alreadyCorrect && !nowCorrect) {
      setCorrectCount(prev => prev - 1);
    }

    setSelectedAnswers(updatedAnswers);
  };

  const handleMarks = () => {
    const data = {
      courseId,
      userId,
      marks: (correctCount / totalQsns) * 100
    };
    axios.post(`http://localhost:8080/api/assessments/add/${userId}/${courseId}`, data)
      .then(response => console.log('Request successful:', response.data))
      .catch(error => console.error('Error:', error));
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test?")) {
      autoSubmitQuiz();
    }
  };

  const handleOk = () => {
    setOpenModal(false);
    navigate("/profile");
  };

  const handleCancel = () => setOpenModal(false);

  let message = '';
  if (correctCount === totalQsns && totalQsns !== 0) {
    message = 'Awesome 😎';
  } else if (correctCount >= totalQsns / 2) {
    message = 'Good 😊';
  } else {
    message = 'Poor 😒';
  }

  if (test.length === 0) {
    return (
      <div style={styles.noQuizContainer}>
        <div style={styles.noQuizCard}>
          <FontAwesomeIcon icon={faFaceSadTear} style={styles.sadIcon} />
          <h2>Oops!</h2>
          <p>It looks like the quiz has not been set for this course yet.</p>
          <button onClick={() => navigate(`/course/${courseId}`)} style={styles.goBackButton}>
            Go Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button type="button" style={styles.backButton} onClick={() => navigate(`/course/${courseId}`)}>
          <FontAwesomeIcon icon={faBackward} />
        </button>
        <h1 style={styles.title}>Assessment</h1>
      </div>

      {!started ? (
        <div style={styles.centered}>
          <div style={styles.rulesBox}>
            <h2 style={styles.rulesTitle}>📜 Exam Rules</h2>
            <ul style={styles.ruleList}>
              <li><span style={styles.ruleIcon}>🧠</span> You can attempt the quiz only once.</li>
              <li><span style={styles.ruleIcon}>⛔</span> Switching tabs more than 3 times will auto-submit the quiz.</li>
              <li><span style={styles.ruleIcon}>📷</span> Webcam access is required to start the quiz.</li>
              <li><span style={styles.ruleIcon}>⏰</span> You must complete the quiz within the time limit.</li>
              <li><span style={styles.ruleIcon}>✅</span> No negative marking. Attempt all questions.</li>
            </ul>
            <div style={styles.agreementBox}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  style={{ marginRight: '10px' }}
                />
                I agree to the above rules.
              </label>
            </div>
            <div style={styles.startButtonWrapper}>
              <button
                style={{
                  ...styles.startButton,
                  opacity: agreedToRules ? 1 : 0.5,
                  cursor: agreedToRules ? 'pointer' : 'not-allowed'
                }}
                onClick={handleStartQuiz}
                disabled={!agreedToRules}
              >
                🚀 Start Quiz
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={styles.timer}>
            Time Left: <span style={{ color: 'red' }}>{formatTime(timeLeft)}</span>
          </div>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: "200px", borderRadius: "10px" }} />
          </div>
          {tabSwitchWarning && (
            <div style={styles.warningBox}>
              <FontAwesomeIcon icon={faTriangleExclamation} /> Please do not switch tabs or minimize. Attempt: {focusLostCount}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {started && test.map((question, index) => (
          <div key={question.no} style={styles.questionCard}>
            <h3>{question.question}</h3>
            {[question.option1, question.option2, question.option3, question.option4].map((option, i) => (
              <label key={i} style={styles.optionLabel}>
                <input
                  type="checkbox"
                  name={`question_${question.no}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleCheckboxChange(index, option)}
                  disabled={timeLeft <= 0}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            ))}
          </div>
        ))}

        {started && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={() => {
                stopCamera();
                clearInterval(timerRef.current);
                navigate(0);
              }}
              style={{ ...styles.button, backgroundColor: '#999' }}
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              style={styles.button}
              disabled={timeLeft === 0}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <Modal
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        style={{ padding: "10px" }}
      >
        <div style={styles.resultCard}>
          <h2 style={{ color: 'darkblue' }}>Assessment Result</h2>
          <h1>{message}</h1>
          <h3>You scored {(correctCount / totalQsns * 100).toFixed(2)}%</h3>
          {loadingRedirect ? (
            <p style={{ color: 'green', fontWeight: 'bold' }}>⏳ Redirecting to your profile...</p>
          ) : (
            <p style={{ fontWeight: 'bold' }}>🎉 Thank you for taking the test!</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "'Segoe UI', sans-serif"
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px"
  },
  backButton: {
    background: "none",
    border: "none",
    color: "darkblue",
    fontSize: "24px",
    cursor: "pointer",
    marginRight: "10px"
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
    backgroundColor: "darkblue",
    color: "white",
    padding: "10px 20px",
    borderRadius: "20px"
  },
  centered: {
    textAlign: "center",
    marginTop: "40px"
  },
  rulesBox: {
    textAlign: "left",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "30px 25px",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e0e0e0"
  },
  rulesTitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2c3e50",
    fontSize: "24px"
  },
  ruleList: {
    listStyle: "none",
    paddingLeft: 0,
    marginBottom: "20px"
  },
  ruleIcon: {
    marginRight: "10px"
  },
  agreementBox: {
    textAlign: "center",
    marginBottom: "20px"
  },
  startButtonWrapper: {
    display: "flex",
    justifyContent: "center"
  },
  checkboxLabel: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center"
  },
  startButton: {
    padding: "12px 40px",
    fontSize: "18px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "25px",
    transition: "background-color 0.3s ease",
    cursor: "pointer"
  },
  timer: {
    textAlign: "center",
    fontSize: "20px",
    marginTop: "10px"
  },
  questionCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  optionLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "16px"
  },
  button: {
    backgroundColor: "green",
    color: "white",
    padding: "10px 20px",
    margin: "0 10px",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    cursor: "pointer"
  },
  resultCard: {
    padding: "10px",
    borderRadius: "12px",
    textAlign: "center"
  },
  noQuizContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f0f2f5'
  },
  noQuizCard: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px'
  },
  sadIcon: {
    fontSize: '48px',
    color: '#ff4d4f',
    marginBottom: '20px'
  },
  goBackButton: {
    marginTop: '20px',
    padding: '10px 30px',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  warningBox: {
    marginTop: "15px",
    textAlign: "center",
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold"
  }
};

export default YourComponent;
