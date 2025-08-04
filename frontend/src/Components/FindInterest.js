import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./header and footer/Footer";

function FindInterest() {
  const [answers, setAnswers] = useState({
    programmingExperience: "",
    learningGoal: "",
    preferredLanguage: "",
    studyTime: "",
    favoriteTechTopic: "",
  });

  const [recommendedCourse, setRecommendedCourse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { programmingExperience, learningGoal, preferredLanguage, studyTime, favoriteTechTopic } = answers;

    // More refined recommendation logic
    let suggestion = "";

    if (programmingExperience === "none") {
      suggestion = "JavaScript Beginner Course";
    } else if (learningGoal === "web") {
      if (preferredLanguage === "python") suggestion = "Python Master Course";
      else suggestion = "Fullstack Web Development";
    } else if (learningGoal === "data") {
      suggestion = "Data Science with SQL & Python";
    } else if (learningGoal === "mobile") {
      suggestion = "Android Development with Java";
    } else if (learningGoal === "design") {
      suggestion = "Advanced UI/UX Design";
    } else {
      suggestion = "CSS Complete Course";
    }

    // Adjust suggestion based on study time
    if (studyTime === "limited") {
      suggestion += " (Short & Effective)";
    }

    // Bonus: personalize suggestion if favorite tech topic matches
    if (favoriteTechTopic.toLowerCase().includes("ai") || favoriteTechTopic.toLowerCase().includes("machine")) {
      suggestion = "AI and Machine Learning Basics";
    }

    setRecommendedCourse(suggestion);
  };

  // Simple styling object
  const styles = {
    container: {
      maxWidth: 700,
      margin: "40px auto",
      backgroundColor: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      padding: 30,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
    },
    header: {
      textAlign: "center",
      marginBottom: 30,
      color: "#6a1b9a",
    },
    questionBlock: {
      marginBottom: 25,
    },
    label: {
      display: "block",
      marginBottom: 10,
      fontWeight: "600",
    },
    select: {
      width: "100%",
      padding: "10px",
      fontSize: 16,
      borderRadius: 6,
      border: "1px solid #ccc",
      outlineColor: "#6a1b9a",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: 16,
      borderRadius: 6,
      border: "1px solid #ccc",
      outlineColor: "#6a1b9a",
    },
    radioGroup: {
      display: "flex",
      gap: "20px",
      marginTop: 8,
    },
    radioLabel: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      cursor: "pointer",
      fontWeight: "500",
    },
    button: {
      backgroundColor: "#6a1b9a",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "12px 25px",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: "600",
      width: "100%",
      marginTop: 10,
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#4a0f6e",
    },
    resultBox: {
      marginTop: 30,
      padding: 20,
      backgroundColor: "#f5e9ff",
      borderRadius: 10,
      textAlign: "center",
      fontWeight: "700",
      fontSize: 20,
      color: "#6a1b9a",
      boxShadow: "0 2px 8px rgba(106,27,154,0.2)",
    },
  };

  return (
    <>
      <Navbar page={"find-interest"} />

      <section style={styles.container}>
        <h1 style={styles.header}>Find Your Interest</h1>
        <p style={{ textAlign: "center", marginBottom: 30 }}>
          Answer these questions to get personalized course recommendations.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.questionBlock}>
            <label style={styles.label}>1. What is your programming experience?</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="programmingExperience"
                  value="none"
                  checked={answers.programmingExperience === "none"}
                  onChange={handleChange}
                  required
                />
                None (I'm a beginner)
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="programmingExperience"
                  value="basic"
                  checked={answers.programmingExperience === "basic"}
                  onChange={handleChange}
                />
                Basic knowledge
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="programmingExperience"
                  value="advanced"
                  checked={answers.programmingExperience === "advanced"}
                  onChange={handleChange}
                />
                Advanced
              </label>
            </div>
          </div>

          <div style={styles.questionBlock}>
            <label style={styles.label}>2. What do you want to learn?</label>
            <select
              name="learningGoal"
              value={answers.learningGoal}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">-- Select --</option>
              <option value="web">Web Development</option>
              <option value="data">Data Management / Databases</option>
              <option value="mobile">Mobile Development</option>
              <option value="design">UI / CSS Design</option>
              <option value="ai">Artificial Intelligence / Machine Learning</option>
            </select>
          </div>

          <div style={styles.questionBlock}>
            <label style={styles.label}>3. Which programming language interests you the most?</label>
            <select
              name="preferredLanguage"
              value={answers.preferredLanguage}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">-- Select --</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="htmlcss">HTML/CSS</option>
              <option value="none">None / Not Sure</option>
            </select>
          </div>

          <div style={styles.questionBlock}>
            <label style={styles.label}>4. How much time can you dedicate to learning per week?</label>
            <select
              name="studyTime"
              value={answers.studyTime}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">-- Select --</option>
              <option value="limited">Less than 5 hours</option>
              <option value="moderate">5-10 hours</option>
              <option value="extensive">More than 10 hours</option>
            </select>
          </div>

          <div style={styles.questionBlock}>
            <label style={styles.label}>5. What tech topic excites you the most? (free text)</label>
            <input
              type="text"
              name="favoriteTechTopic"
              value={answers.favoriteTechTopic}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g. AI, Web apps, Cybersecurity"
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4a0f6e")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6a1b9a")}
          >
            Get Recommendation
          </button>
        </form>

        {recommendedCourse && (
          <div style={styles.resultBox}>
            Recommended Course for You:<br />
            <span style={{ fontSize: 24, marginTop: 10, display: "block" }}>{recommendedCourse}</span>
          </div>
        )}
      </section>

     
    </>
  );
}

export default FindInterest;
