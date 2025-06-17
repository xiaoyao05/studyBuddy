import React, { useState } from 'react';

const GroupFilterPage = () => {
  // Sample group data
  const [allGroups, setAllGroups] = useState([
    // {
    //   id: 1,
    //   name: '',
    //   location: '',
    //   date: '',
    //   participants: '',
    //   course: '',
    //   module: '',
    //   members: ['user1', 'user2']
    // }
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    location: '',
    date: '',
    course: '',
    module: '',
    participants: '',
    groupSizes: '',
  });

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique values for filter options
  const locations = [...new Set(allGroups.map(group => group.location))];
  const dates = [...new Set(allGroups.map(group => group.date))];
  const courses = [...new Set(allGroups.map(group => group.course))];
  const modules = [...new Set(allGroups.map(group => group.module))];
  const groupSizes = [...new Set(allGroups.map(group => group.participants))];

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
    
    // Course filter
    if (filters.course && group.course !== filters.course) {
      return false;
    }
    
    // Module filter
    if (filters.module && group.module !== filters.module) {
      return false;
    }

    // Group size filter 
    if (filters.groupSizes && !group.participants.includes(filters.groupSizes)) {
      return false;
    }
    
    // Participants filter (shows only groups with available spots)
    if (filters.participants === 'available') {
      const [current, max] = group.participants.split('/').map(Number);
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
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      date: '',
      course: '',
      module: '',
      participants: '',
      groupSizes: '',
    });
    setSearchTerm('');
  };

  const handleJoinGroup = (groupId) => {
    setAllGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          const [current, max] = group.participants.split('/').map(Number);
          
          if (current < max) {
            return {
              ...group,
              participants: `${current + 1}/${max}`,
              members: [...group.members, 'currentUser'] // Replace with actual user ID
            };
          }
        }
        return group;
      })
    );
    alert('Your request has been submitted successfully!');
  };

  return (
    <div className="group-filter-page">
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
            name="course"
            value={filters.course}
            onChange={handleFilterChange}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
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
              <option key={size} value={size}>{size}</option>
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
              const [current, max] = group.participants.split('/').map(Number);
              const canJoin = current < max;

              return (
                <div key={group.id} className="group-card">
                  <h3>{group.name}</h3>
                  <p>📍 {group.location}</p>
                  <p>📅 {group.date}</p>
                  <p>👥 {group.participants} participants</p>
                  <p>📚 {group.course} - {group.module}</p>
                  
                  {/* NEW: Action buttons container */}
                  <div className="group-actions">
                    <button className="view-btn">View Details</button>
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