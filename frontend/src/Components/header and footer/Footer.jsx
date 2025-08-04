import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom'; // <-- Make sure this is imported
import '../css/style.css';

function Footer() {
  return (
    <section id='footer'>
      <footer>
        <div className="footer-col">
          <h3>Master Courses</h3>
          <li>Web Development</li>
          <li>Programming</li>
          <li>Machine Learning</li>
          <li>Project Fundamentals</li>
        </div>
        <div className="footer-col">
          <h3>Intermediate Courses</h3>
          <li>Web Development</li>
          <li>Programming</li>
          <li>Machine Learning</li>
          <li>Project Fundamentals</li>
        </div>
        <div className="footer-col">
          <h3>Beginner Courses</h3>
          <li>Web Development</li>
          <li>Programming</li>
          <li>Machine Learning</li>
          <li>Project Fundamentals</li>
        </div>
        
        <div className="copyright">
          <div className="pro-links">
            <FontAwesomeIcon icon={faFacebookF} className="i" />
            <FontAwesomeIcon icon={faInstagram} className="i" />
            <FontAwesomeIcon icon={faLinkedinIn} className="i" />
          </div>
          {/* Admin Login Link */}
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <Link to="/admin-login" style={{ color: "#fff", textDecoration: "underline" }}>
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default Footer;
