import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GroupParticipantsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    // Mock data (to be replaced with actual API call)
    const mockGroups = {
      1: {
        name: 'Study Group A',
        participants: ['user1', 'user2', 'user3'],
        participantDetails: {
          user1: {
            name: 'John Doe',
            email: 'john@example.com',
            course: 'Computer Science',
            year: '2',
            gender: 'Male',
            telegramHandle: 'johndoe123'
          },
          user2: {
            name: 'Alice Smith',
            email: 'alice@example.com',
            course: 'Computer Science',
            year: '3',
            gender: 'Female',
            telegramHandle: 'alicesmith'
          },
          user3: {
            name: 'Bob Johnson',
            email: 'bob@example.com',
            course: 'Computer Science',
            year: '1',
            gender: 'Male',
            telegramHandle: 'bobjohnson'
          }
        }
      },
      2: {
        name: 'Math Study Group',
        participants: ['user4', 'user5', 'user6', 'user7', 'user8'],
        participantDetails: {
          user4: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            course: 'Mathematics',
            year: '3',
            gender: 'Female',
            telegramHandle: 'janesmith456'
          },
          user5: {
            name: 'Mike Brown',
            email: 'mike@example.com',
            course: 'Mathematics',
            year: '2',
            gender: 'Male',
            telegramHandle: 'mikebrown'
          },
          user6: {
            name: 'Sarah Lee',
            email: 'sarah@example.com',
            course: 'Mathematics',
            year: '4',
            gender: 'Female',
            telegramHandle: 'sarahlee'
          },
          user7: {
            name: 'David Wilson',
            email: 'david@example.com',
            course: 'Mathematics',
            year: '1',
            gender: 'Male',
            telegramHandle: 'davidwilson'
          },
          user8: {
            name: 'Emma Davis',
            email: 'emma@example.com',
            course: 'Mathematics',
            year: '2',
            gender: 'Female',
            telegramHandle: 'emmadavis'
          }
        }
      }
    };

    setGroup(mockGroups[groupId]);
    setParticipants(mockGroups[groupId]?.participants || []);
  }, [groupId]);

  return (
    <div className="participants-page">
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        ← Back to Group
      </button>

      <h1>Participants of {group?.name}</h1>
      
      <div className="participants-list">
        {participants.map(userId => {
          const participant = group?.participantDetails[userId];
          
          return (
            <div key={userId} className="participant-card">
              <div className="participant-header">
                <h3>{participant?.name || 'Unknown User'}</h3>
              </div>
              
              <div className="participant-details">
                <p><strong>Email:</strong> {participant?.email}</p>
                <p><strong>Course:</strong> {participant?.course}</p>
                <p><strong>Year:</strong> {participant?.year}</p>
                <p><strong>Gender:</strong> {participant?.gender}</p>
                <p>
                  <strong>Telegram:</strong>{' '}
                  {participant?.telegramHandle ? (
                    <span 
                      className="telegram-link"
                      onClick={() => window.open(`https://t.me/${participant.telegramHandle}`, '_blank')}
                    >
                      @{participant.telegramHandle}
                    </span>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupParticipantsPage;