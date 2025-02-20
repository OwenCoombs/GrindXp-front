import { useState, useEffect } from 'react';
import './dashboard.css';
import { Line } from 'react-chartjs-2'; // For the progress graph
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    first_name: '',
    last_name: '',
    profilePic: null
  });
  const [challenges, setChallenges] = useState([
    { name: 'Complete 10 workouts this week', progress: 5 },
    { name: 'Run 50 miles this month', progress: 20 }
  ]);
  const [rewards, setRewards] = useState([
    { name: 'Bronze Badge', xp: 500 },
    { name: 'Silver Badge', xp: 1000 }
  ]);
  const [workouts, setWorkouts] = useState([
    { type: 'Yoga', date: '2025-02-01' },
    { type: 'Running', date: '2025-02-02' }
  ]);
  const [streak, setStreak] = useState(12); // Example streak value

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });
      const data = await response.json();
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        profilePic: null
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('bio', formData.bio);
    form.append('first_name', formData.first_name);
    form.append('last_name', formData.last_name);
    if (formData.profilePic) {
      form.append('profilePic', formData.profilePic);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/profile/update/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        body: form
      });
      const data = await response.json();
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePic: e.target.files[0]
    });
  };

  // Chart.js configuration for tracking weight or body measurements
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Example months
    datasets: [
      {
        label: 'Weight',
        data: [70, 72, 71, 73, 74], // Example weight data
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Progress Over Time'
      },
    },
  };

  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-pic-container">
            <img 
              src={profile.profilePic || '/placeholder.svg?height=100&width=100'} 
              alt="Profile" 
              className="profile-pic"
            />
            {isEditing && (
              <input
                type="file"
                onChange={handleFileChange}
                className="profile-pic-input"
              />
            )}
          </div>
          <div className="profile-info">
            <h1>{profile.username}</h1>
            <div className="xp-container">
              <div className="xp-bar">
                <div 
                  className="xp-progress" 
                  style={{ width: `${(profile.xp % 1000) / 10}%` }}
                ></div>
              </div>
              <span className="xp-text">{profile.xp} XP</span>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <div className="profile-details">
            <p className="bio">{profile.bio}</p>
            <p className="name">
              {profile.first_name} {profile.last_name}
            </p>
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({
                  ...formData,
                  first_name: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({
                  ...formData,
                  last_name: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({
                  ...formData,
                  bio: e.target.value
                })}
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="dashboard-stats">
        <div className="progress-graph">
          <h2>Progress Graph</h2>
          <Line data={data} options={options} />
        </div>

        <div className="achievements">
          <h2>Achievements & Streaks</h2>
          <p>{streak} days of activity in a row!</p>
          <div className="reward-list">
            <h3>Rewards:</h3>
            {rewards.map((reward, index) => (
              <div key={index} className="reward-item">
                <span>{reward.name}</span>
                <span>{reward.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="challenges">
          <h2>Active Challenges</h2>
          {challenges.map((challenge, index) => (
            <div key={index} className="challenge-item">
              <p>{challenge.name}</p>
              <div className="challenge-progress">
                <span>{challenge.progress} completed</span>
                <span> / 10</span>
              </div>
            </div>
          ))}
        </div>

        <div className="start-workout">
          <button className="start-button">
            Start New Workout
          </button>
        </div>
      </div>
    </div>
  );
}
