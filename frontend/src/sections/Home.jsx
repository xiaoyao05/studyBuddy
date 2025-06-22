import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../httpClient';
import TopNav from './TopNav';

const GroupFilterPage = () => {
  const navigate = useNavigate();
  const [allGroups, setAllGroups] = useState([]);
  const [email, setemail] = useState("");
  const [id, setid] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpClient.get("/api/@me");
        console.log(resp.data);
        setemail(resp.data.email);
        setid(resp.data.id);

        const groupsResp = await httpClient.get("/api/get-groups");
        console.log("group data", groupsResp.data);
        setAllGroups(groupsResp.data);
      } catch (error) {
        alert("Not authenticated");
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  // State for filters
  const [filters, setFilters] = useState({
    location: '',
    date: '',
    module: '',
    participants: '',
    groupSizes: '',
  });

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique values for filter options
  const locations = [...new Set(allGroups.map(group => group.location))];
  const dates = [...new Set(allGroups.map(group => group.date))];
  const modules = [...new Set(allGroups.map(group => group.module))];
  const groupSizes = [...new Set(allGroups.map(group => parseInt(group.groupSize)))];

  // Filter groups based on criteria
  const filteredGroups = allGroups.filter(group => {
    // Search term filter (name only)
    if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (filters.location && group.location !== filters.location) {
      return false;
    }
    
    // Date filter
    if (filters.date && group.date !== filters.date) {
      return false;
    }
    
    // Module filter
    if (filters.module && group.module !== filters.module) {
      return false;
    }

    // Group size filter 
    if (filters.groupSizes && group.groupSize !== parseInt(filters.groupSizes, 10)) {
      console.log(filters.groupSizes, typeof(filters.groupSizes));
      console.log(group.groupSize)
      console.log(filters);
      return false;
    }
    
    // Participants filter (shows only groups with available spots)
    if (filters.participants === 'available') {
      const [current, max] = [group.participantCount, group.groupSize];
      if (current >= max) {
        return false;
      }
    }
    
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'groupSizes' ? parseInt(value, 10) || '' : value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      date: '',
      module: '',
      participants: '',
      groupSizes: '',
    });
    setSearchTerm('');
  };

  const handleJoinGroup = (groupId) => {
    const currentUserId = session.get('user_id');
    setAllGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          const [current, max] = [group.participantCount, group.groupSize];
          
          if (current < max) {
            return {
              ...group,
              participants: `${current + 1}/${max}`,
              members: [...group.members, 'currentUserId'] // Replace with actual user ID
            };
          }
        }
        return group;
      })
    );
    alert('Your request has been submitted successfully!');
  };

  const viewHostProfile = (hostId) => {
    navigate(`/profileView`, { state: { viewOnly: true, userID:hostId } });
  };

  const viewParticipants = (groupId, groupName) => {
    navigate(`/group/${groupId}/${groupName}/participants`);
  };


  return (
    <div className="group-filter-page">
      <TopNav/>

      <h1>Find Groups</h1>
      
      {/* Search and Filter Section */}
      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by group name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="filter-controls">
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <select
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          >
            <option value="">All Dates</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
      
          <select
            name="module"
            value={filters.module}
            onChange={handleFilterChange}
          >
            <option value="">All Modules</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
          
          <select
            name="groupSizes"
            value={filters.groupSizes}
            onChange={handleFilterChange}
          >
            <option value="">All Group Sizes</option>
            {groupSizes.map(size => (
              <option key={size} value={parseInt(size)}>{size}</option>
            ))}
          </select>

          <select
            name="participants"
            value={filters.participants}
            onChange={handleFilterChange}
          >
            <option value="">All Groups</option>
            <option value="available">Only Available Spots</option>
          </select>
          
          <button onClick={resetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="results-section">
        <h2>{filteredGroups.length} Groups Found</h2>
        
        {filteredGroups.length > 0 ? (
          <div className="groups-grid">
            {filteredGroups.map(group => {
              const [current, max] = [group.participantCount, group.groupSize];
              const canJoin = current < max;

              return (
                <div key={group.sessionID} className="group-card">
                  <h3>{group.name}</h3>
                  <p>📍 {group.location}</p>
                  <p>📅 {group.date}</p>
                  <p 
                    className="participants-link"
                    onClick={() => viewParticipants(group.sessionID, group.name)}
                  >
                    👥 {group.participantCount}/{group.groupSize} participants
                  </p>
                  <p>📚 {group.module}</p>
                  <p> 🧑‍💼 Host: {' '}
                    <span 
                      className="host-link"
                      onClick={() => viewHostProfile(group.admin.id, group.name)}
                    >
                      {group.admin.name}
                    </span>
                  </p>
                  
                  {/* NEW: Action buttons container */}
                  <div className="group-actions">
                    <button 
                      className={`join-btn ${!canJoin ? 'disabled' : ''}`}
                      onClick={() => canJoin && handleJoinGroup(group.id)}
                      disabled={!canJoin}
                    >
                      {canJoin ? 'Join Group' : 'Group Full'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <p>No groups match your filters.</p>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupFilterPage;