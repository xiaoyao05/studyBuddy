import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../httpClient';
import TopNav from './TopNav';

const RequestManagementPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpClient.get("/api/@me");
        console.log(resp.data);
        const req = await httpClient.get(`/api/get_requests`);
        setRequests(req.data);
      } catch (error) {
        alert("Not authenticated");
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  // Filter requests based on status
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const viewRequesterProfile = (requesterId) => {
    navigate("/profileView", { state: { viewOnly: true, userID: requesterId} });
  };

  // Handle request actions
  const handleAccept = async (reqID) => {
    try{
      const resp = await httpClient.post(`/api/respond_request/${reqID}`, {status:"approved"});
      navigate('/home');
      alert('Accepted request successfully!');
    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  const handleReject = async (reqID) => {
    try{
      const resp = await httpClient.post(`/api/respond_request/${reqID}`, {status:"rejected"});
      navigate('/home');
      alert('Rejected request successfully!');
    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  return (
    <div className="request-management-page">
       <TopNav/>
       <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        ← Back to Groups
      </button>

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
            <div key={request.requestID} className={`request-card ${request.status}`}>
              <div className="request-header">
                <h3>{request.requester}</h3>
              </div>
              <div className="request-details">
                <p><strong>Date and Time of Request:</strong> {new Date(request.dateTime).toLocaleString()}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p> 🧑‍💼 Requester: {' '}
                    <span 
                      className="requester-link"
                      onClick={() => viewRequesterProfile(request.requesterID)}
                    >
                      {request.requester}
                    </span>
                  </p>
              </div>
              {request.status === 'pending' && (
                <div className="request-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAccept(request.requestID)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(request.requestID)}
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