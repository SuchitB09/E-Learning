import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { jsPDF } from "jspdf";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ cardName: "" });
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem("id");
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  // Receipt PDF generator function (styled like a real receipt)
  const generateReceiptPDF = (paymentIntentId, courseName, userName, amount) => {
    const doc = new jsPDF();

    doc.setFillColor(245, 245, 245);
    doc.rect(10, 10, 190, 140, "F");

    doc.setFontSize(24);
    doc.setTextColor("#2c3e50");
    doc.setFont("helvetica", "bold");
    doc.text("Payment Receipt", 105, 30, null, null, "center");

    doc.setDrawColor("#2980b9");
    doc.setLineWidth(0.8);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#7f8c8d");
    doc.text("E- Learning Platform", 105, 40, null, null, "center");
    doc.text("www.E-learning.com", 105, 45, null, null, "center");

    doc.setFontSize(14);
    doc.setTextColor("#34495e");
    doc.setFont("helvetica", "normal");
    doc.text("Name:", 20, 60);
    doc.setFont("helvetica", "bold");
    doc.text(userName, 60, 60);

    doc.setFont("helvetica", "normal");
    doc.text("Course:", 20, 75);
    doc.setFont("helvetica", "bold");
    doc.text(courseName, 60, 75);

    doc.setFont("helvetica", "normal");
    doc.text("Amount Paid:", 20, 90);
    doc.setFont("helvetica", "bold");
    doc.text(`₹${amount}`, 60, 90);

    doc.setFont("helvetica", "normal");
    doc.text("Payment ID:", 20, 105);
    doc.setFont("helvetica", "bold");
    doc.text(paymentIntentId, 60, 105);

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${dateStr}`, 20, 120);
    doc.text(`Time: ${timeStr}`, 20, 128);

    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor("#7f8c8d");
    doc.text("Thank you for your purchase!", 105, 135, null, null, "center");

    doc.save(`Receipt_${paymentIntentId}.pdf`);
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });

    if (userId) {
      fetch(`http://localhost:8080/api/learning/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          const enrolledCourseIds = data.map((item) => item.course_id);
          setEnrolled(enrolledCourseIds);
        })
        .catch((error) =>
          console.error("Error fetching enrolled courses:", error)
        );
    }
  }, [userId]);

  const handlePaymentInput = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const enrollCourse = (courseId) => {
    axios
      .post("http://localhost:8080/api/learning", {
        userId: userId,
        courseId: courseId,
      })
      .then((response) => {
        if (response.data === "Enrolled successfully") {
          toast.success("Course Enrolled successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setTimeout(() => {
            navigate(`/course/${courseId}`);
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Enrollment error:", error);
        toast.error("Error enrolling in the course");
      });
  };

  const handleBuyNow = (course) => {
    if (!authToken) {
      toast.error("You need to login to continue", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setSelectedCourse(course);
      setShowModal(true);
      fetchPaymentIntent(course.course_id);
    }
  };

  const fetchPaymentIntent = (courseId) => {
    axios
      .post(`http://localhost:8080/api/payment-intent`, { courseId })
      .then((response) => {
        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
        } else {
          toast.error("Error: Payment intent could not be created.");
        }
      })
      .catch((error) => {
        console.error("Error fetching payment intent:", error);
        toast.error("Error fetching payment details. Please try again.");
      });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!stripe || !elements || !clientSecret) {
      toast.error("Stripe.js has not loaded yet.");
      setIsSubmitting(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card details are missing.");
      setIsSubmitting(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentDetails.cardName,
          },
        },
      }
    );

    if (error) {
      toast.error(`Payment failed: ${error.message}`);
      setIsSubmitting(false);
    } else if (paymentIntent.status === "succeeded") {
      const userName = localStorage.getItem("username") || "User";

      try {
        // Save payment to backend
        await axios.post("http://localhost:8080/api/payments", {
          paymentIntentId: paymentIntent.id,
          userId: parseInt(userId),
          courseId: selectedCourse.course_id,
          amount: selectedCourse.price,
          status: paymentIntent.status,
        });

        generateReceiptPDF(
          paymentIntent.id,
          selectedCourse.courseName,
          userName,
          selectedCourse.price
        );

        toast.success("Payment successful!");
        setShowModal(false);
        setShowSuccessModal(true);
        // Do not enroll here, wait for modal close
      } catch (saveError) {
        toast.error(
          `Payment succeeded but saving payment failed: ${saveError.message}`
        );
        console.error("Save payment error:", saveError);
      }

      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    enrollCourse(selectedCourse.course_id);
  };

  return (
    <div>
      <Navbar page={"courses"} />
      <div
        className="courses-container"
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          courses.map((course) => (
            <div
              key={course.course_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                width: "280px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                minHeight: "380px",
              }}
            >
              <img
                src={course.p_link}
                alt={course.course_name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <div style={{ marginTop: "10px" }}>
                <h3 style={{ margin: "10px 0" }}>
                  {course.courseName.length < 8
                    ? `${course.courseName} Tutorial`
                    : course.courseName}
                </h3>
                <p style={{ color: "grey" }}>Price: Rs.{course.price}</p>
                <p>Tutorial by {course.instructor}</p>
              </div>
              {enrolled.includes(course.course_id) ? (
                <button
                  style={{
                    marginTop: "10px",
                    backgroundColor: "darkblue",
                    color: "#F4D03F",
                    fontWeight: "bold",
                    border: "none",
                    padding: "10px",
                    width: "100%",
                    borderRadius: "5px",
                  }}
                  onClick={() => navigate("/learnings")}
                >
                  Enrolled
                </button>
              ) : (
                <button
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    width: "100%",
                    borderRadius: "5px",
                  }}
                  onClick={() => handleBuyNow(course)}
                >
                  Buy Now
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      {showModal && selectedCourse && (
        <div
          className="payment-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              width: "380px",
              boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                textAlign: "center",
                color: "#2980b9",
              }}
            >
              Payment for {selectedCourse.courseName}
            </h2>
            <form onSubmit={handlePaymentSubmit}>
              <label htmlFor="cardName">Cardholder Name</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={paymentDetails.cardName}
                onChange={handlePaymentInput}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "15px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              <label>Card Details</label>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              >
                <CardElement options={{ hidePostalCode: true }} />
              </div>

              <button
                type="submit"
                disabled={!stripe || isSubmitting}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#2980b9",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Processing..." : `Pay ₹${selectedCourse.price}`}
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "8px",
                width: "100%",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showSuccessModal && (
        <div
          className="success-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "30px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ color: "green" }}>Payment Successful!</h2>
            <p>You have successfully purchased the course.</p>
            <button
              onClick={handleSuccessModalClose}
              style={{
                marginTop: "20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
