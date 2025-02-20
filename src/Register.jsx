import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import './Register.css';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://grindxp-backend.fly.dev/api/register/', {
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      const { access, refresh, profile } = response.data;

      // Store tokens
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      // Store user profile data
      localStorage.setItem('username', profile.user.username);
      localStorage.setItem('profilePic', profile.profilePic || "");
      localStorage.setItem('xp', profile.xp ?? "0");
      localStorage.setItem('bio', profile.bio || "");

      console.log("Registration successful:", response.data);
      // Redirect or update UI
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Fill in the details to sign up</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? <div className="loading-spinner"></div> : "Sign up"}
          </button>
        </form>

        {/* Link to the Register page */}
        <div className="register-link">
          <p>Already have an account? <Link to="/">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
