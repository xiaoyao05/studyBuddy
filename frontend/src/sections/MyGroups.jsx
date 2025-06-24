import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../httpClient';
import TopNav from './TopNav';
import './MyGroups.css';

const MyGroupsPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  const fetchData = async () => {
    try {
      const resp = await httpClient.get("/api/@me");
      const joined_groups = await httpClient.get(`/api/joined-groups`);
      setGroups(joined_groups.data);        
    } catch (error) {
      alert("Not authenticated");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdrawal = async (studySessionID) => {
    try {
      const resp = await httpClient.delete("/api/withdrawal", {
        data: { studySessionID }
      });
      alert(resp.data.message);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="my-groups-page">
      <TopNav />
      <button onClick={() => navigate(-1)} className="back-button">
          ← Back
      </button>

      <div className="content-wrapper">
        <h1>My Groups</h1>

        {groups.length === 0 ? (
          <p>You haven't joined any groups yet.</p>
        ) : (
          <ul className="group-list">
            {groups.map((group) => (
              <li key={group.sessionID} className="group-card">
                <h2>{group.name}</h2>
                <p><strong>Location:</strong> {group.location}</p>
                <p><strong>Date:</strong> {group.date}</p>
                <p><strong>Time:</strong> {group.startTime} - {group.endTime}</p>
                <p><strong>Pax:</strong> {group.participation}/{group.groupSize}</p>
                <p><strong>Description:</strong> {group.description}</p>
                <button 
                  onClick={() => handleWithdrawal(group.sessionID)} 
                  className="withdraw-button"
                >
                  Withdraw
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyGroupsPage;
