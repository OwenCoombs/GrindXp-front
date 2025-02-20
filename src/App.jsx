import axios from 'axios';
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom'; // Import Link for navigation
import "./App.css";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://grindxp-backend.fly.dev/api/login/', {
        username: formData.email, // Use "username" instead of "email"
        password: formData.password,
      });

      const { access, refresh, username, profilePic, xp, bio } = response.data;

      // Store tokens
      localStorage.setItem('access', access); // Correct token name
      localStorage.setItem('refresh', refresh);

      // Store user profile data
      localStorage.setItem('username', username);
      localStorage.setItem('profilePic', profilePic || ""); // Handle null values
      localStorage.setItem('xp', xp ?? "0"); // Default XP to "0" if null
      localStorage.setItem('bio', bio || "");

      console.log("Login successful:", response.data);

      // Wait 3 seconds before navigating
      setTimeout(() => {
        navigate('/dashboard'); // Navigate to the dashboard after successful login
      }, 3000);
      
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="icon-container">
            <div className="dumbbell-icon">
              <div className="bar"></div>
              <div className="weight left"></div>
              <div className="weight right"></div>
            </div>
          </div>
          <h1>Welcome back</h1>
          <p>Please enter your details to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your username"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? <div className="loading-spinner"></div> : "Sign in"}
          </button>
        </form>

        {/* Link to the Register page */}
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
