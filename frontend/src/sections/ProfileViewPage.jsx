import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import httpClient from '../httpClient';
import TopNav from './TopNav';

const ProfileViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userID, setuserID] = useState(location.state.userID);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpClient.get("/api/@me");
        console.log(resp.data, userID);
        const pf = await httpClient.get(`/api/get-profile/${userID}`);
        setProfile(pf.data);        
      } catch (error) {
        alert("Not authenticated");
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  const openTelegram = (username) => {
    window.open(`https://t.me/${username}`, '_blank', 'noopener,noreferrer');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-view">
       <TopNav/>
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        ← Back to Groups
      </button>
      
      <h1>{profile.name}'s Profile</h1>
      <div className="profile-info">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Course:</strong> {profile.course}</p>
        <p><strong>Year:</strong> {profile.year}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p>
          <strong>Telegram:</strong>{' '}
          {profile.tele ? (
            <span
              onClick={() => openTelegram(profile.tele)}
              className="telegram-link"
              style={{ cursor: 'pointer' }}
            >
              @{profile.tele}
            </span>
          ) : (
            'Not provided'
          )}
        </p>
      </div>
    </div>
  );
};

export default ProfileViewPage;