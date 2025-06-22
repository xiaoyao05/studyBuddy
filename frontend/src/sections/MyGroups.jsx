import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../httpClient';
import TopNav from './TopNav';

const MyGroupsPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpClient.get("/api/@me");
        if (resp) {
          const grp = await httpClient.get("/api/joined-groups");
          setGroups(grp.data);
        }
      } catch (error) {
        alert("Not authenticated");
        navigate("/login")
      }
    };
    fetchData();
  }, []);

  return (
    <div className="my-groups-page">
      <TopNav/>
      <h1>My Groups</h1>

      {groups.length === 0 ? (
        <p>You haven't joined any groups yet.</p>
      ) : (
        <ul className="group-list">
          {groups.map((group, index) => (
            <li key={index} className="group-card">
              <h2>{group.name}</h2>
              <p><strong>Location:</strong> {group.location}</p>
              <p><strong>Date & Time:</strong> {group.datetime}</p>
              <p><strong>Max Pax:</strong> {group.maxPax}</p>
              <p><strong>Description:</strong> {group.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyGroupsPage;