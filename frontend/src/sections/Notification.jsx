import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../httpClient';
import TopNav from './TopNav';

const RequestManagementPage = () => {
  const navigate = useNavigate();
  const hostId = session.get("user_id")
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpClient.get("/api/@me");
        if (resp){
          const req = await httpClient.get(`/api/get/${hostId}/requests`);
          setRequests(req.data);
        }
      } catch (error) {
        alert("Not authenticated");
        navigate("/login");
      }
    };
    fetchData();
  }, [hostId]);

  // Filter requests based on status
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const viewRequesterProfile = (requesterId) => {
    navigate(`/profile/${requesterId}`, { state: { viewOnly: true } });
  };

  // Handle request actions
  const handleAccept = (id) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: 'accepted' } : request
    ));
  };

  const handleReject = (id) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: 'rejected' } : request
    ));
  };

  return (
    <div className="request-management-page">
       <TopNav/>
      <h1>Request Management</h1>
      
      {/* Filter controls */}
      <div className="filter-controls">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Requests
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'accepted' ? 'active' : ''}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>
      
      {/* Requests list */}
      <div className="requests-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <div key={request.id} className={`request-card ${request.status}`}>
              <div className="request-header">
                <h3>{request.userName}</h3>
              </div>
              <div className="request-details">
                <p><strong>Date and Time of Request:</strong> {request.DateTime}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p> 🧑‍💼 Requester: {' '}
                    <span 
                      className="requester-link"
                      onClick={() => viewRequesterProfile(request.studentID)}
                    >
                      {request.student.name}
                    </span>
                  </p>
              </div>
              {request.status === 'pending' && (
                <div className="request-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-requests">
            <p>No requests found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestManagementPage;