import React, { useEffect, useState } from 'react';

const MyGroupsPage = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Load joined groups — in a real app, replace this with an API call or context
    const joined = JSON.parse(localStorage.getItem('joinedGroups')) || [];
    setGroups(joined);
  }, []);

  return (
    <div className="my-groups-page">
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
