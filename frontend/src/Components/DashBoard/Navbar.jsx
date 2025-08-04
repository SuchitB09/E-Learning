import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored session or user info
    localStorage.clear();

    // Optional: Clear any global state (e.g., context)
    // setUser(null); // if using user context

    // Navigate to home page
    navigate("/");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <i className='bx bx-menu'></i>
        <h4>Menu</h4>
      </div>

      <form action="#">
        <div className="form-input">
          {/* Add search or other inputs here if needed */}
        </div>
      </form>

      <button
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
