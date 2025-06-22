import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import httpClient from "../httpClient";

const GroupParticipantsPage = () => {
  const { groupId, groupName } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("xyxyxy")
        const resp = await httpClient.get("/api/@me");
        console.log("hehe", resp.data);

        const partx = await httpClient.post("/api/getGrpParticipants", {groupId});
        console.log("group participants", partx.data);
        setParticipants(partx.data);
      } catch (error) {
        alert("Not authenticated");
        navigate("/login");
      }
    };
    fetchData();
    
  }, []);

  return (
    <div className="participants-page">
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        ← Back to Group
      </button>

      <h1>Participants of {groupName}</h1>
      
      <div className="participants-list">
        {participants.map(p => {
          
          return (
            <div key={p.email} className="participant-card">
              <div className="participant-header">
                <h3>{p.name}</h3>
              </div>
              
              <div className="participant-details">
                <p><strong>Email:</strong> {p.email}</p>
                <p><strong>Course:</strong> {p.course}</p>
                <p><strong>Year:</strong> {p.year}</p>
                <p><strong>Gender:</strong> {p.gender}</p>
                <p>
                  <strong>Telegram:</strong>{' '}
                  {p.tele ? (
                    <span 
                      className="telegram-link"
                      onClick={() => window.open(`https://t.me/${p.tele}`, '_blank')}
                    >
                      @{p.tele}
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