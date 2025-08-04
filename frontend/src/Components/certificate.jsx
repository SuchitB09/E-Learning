import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-dom-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import img from './images/logo.jpg';
import seal from './images/seal.png';

const Certificate = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [error, setError] = useState(false);
  const courseId = window.location.pathname.split("/")[2];
  const [course, setCourse] = useState({
    course_name: "",
    instructor: "",
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }

    async function fetchUserDetails() {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        setUserDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(true);
      }
    }

    async function fetchCourse() {
      try {
        const response = await fetch(`http://localhost:8080/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course data.");
        }

        const fetchedCourse = await response.json();
        setCourse(fetchedCourse);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(true);
      }
    }

    fetchCourse();
    fetchUserDetails();
  }, [authToken, navigate, id, courseId]);

  const generateCertificateNumber = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const currentDate = formatDate(new Date());
  const certificateNumber = generateCertificateNumber();

  const leftConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 80,
    elementCount: 270,
    dragFriction: 0.1,
    duration: 4000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#3498db", "#e74c3c", "#27ae60"],
  };

  const rightConfig = {
    angle: 90,
    spread: 180,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.1,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#3498db", "#e74c3c", "#27ae60"],
  };

  const [pdfDownloading, setPdfDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setPdfDownloading(true);
  
    const certificateElement = document.getElementById("certificate");
  
    if (certificateElement) {
      html2canvas(certificateElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("certificate.pdf");
  
        setPdfDownloading(false);
      });
    } else {
      console.error("Certificate element not found.");
    }
  };
  

  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        margin: 0,
        padding: "20px",
        backgroundColor: "#f1f1f1",
      }}
    >
      <Confetti active={!loading} config={leftConfig} />
      <Confetti active={!loading} config={rightConfig} />
      {loading ? (
        <p style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#3498db" }}>Loading...</p>
      ) : (
        <div
          id="certificate"
          style={{
            maxWidth: "650px",
            margin: "50px auto",
            textAlign: "center",
            background: "linear-gradient(135deg, #3498db, #8e44ad)",
            padding: "40px",
            borderRadius: "15px",
            border: "5px solid #fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            position: "relative",
            overflow: "hidden",
            color: "#fff",
          }}
        >
          <img
            src={img}
            alt="Logo"
            style={{
              width: "120px",
              height: "auto",
              marginBottom: "20px",
              borderRadius: "50%",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
            }}
          />
          <h1
            style={{
              fontSize: "36px",
              marginBottom: "20px",
              fontFamily: "'Georgia', serif",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Certificate of Completion
          </h1>
          <p
            style={{
              fontSize: "22px",
              fontStyle: "italic",
              marginBottom: "20px",
              color: "#fff",
            }}
          >
            This is to certify that{" "}
            <span
              id="userName"
              style={{
                fontWeight: "bold",
                fontSize: "28px",
                color: "#e74c3c",
              }}
            >
              {userDetails.username}
            </span>
          </p>
          <p
            style={{
              fontSize: "22px",
              marginBottom: "15px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            has successfully completed the course{" "}
            <span
              id="courseName"
              style={{
                color: "#f39c12",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              {course.course_name.length < 10
                ? course.course_name + " Tutorial"
                : course.course_name}
            </span>
          </p>
          <p style={{ fontSize: "18px", color: "#ccc", marginBottom: "15px" }}>
            Issued on {currentDate}
          </p>
          <p style={{ fontSize: "18px", color: "#ccc", marginBottom: "30px" }}>
            Certificate ID: {certificateNumber}
          </p>
          <img
            src={seal}
            alt="Seal"
            style={{
              width: "120px",
              height: "auto",
              marginTop: "30px",
              opacity: 0.8,
            }}
          />
        </div>
      )}
      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop: "30px",
          padding: "12px 30px",
          fontSize: "18px",
          backgroundColor: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "0.3s ease-in-out",
        }}
      >
        {pdfDownloading ? "Downloading..." : "Download Certificate as PDF"}
      </button>
    </div>
  );
};

export default Certificate;
