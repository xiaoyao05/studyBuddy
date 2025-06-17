import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProfileViewPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); 
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProfiles = {
      user1: {
        name: 'John Doe',
        email: 'john@example.com',
        course: 'Computer Science',
        year: '2',
        gender: 'Male',
        telegramHandle: 'johndoe123'
      },
      user4: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        course: 'Mathematics',
        year: '3',
        gender: 'Female',
        telegramHandle: 'janesmith456'
      }
    };
    
    setProfile(mockProfiles[userId]);
  }, [userId]);

  const openTelegram = (username) => {
    window.open(`https://t.me/${username}`, '_blank', 'noopener,noreferrer');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-view">
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
          {profile.telegramHandle ? (
            <span
              onClick={() => openTelegram(profile.telegramHandle)}
              className="telegram-link"
              style={{ cursor: 'pointer' }}
            >
              @{profile.telegramHandle}
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