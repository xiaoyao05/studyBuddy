import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Home from './sections/Home';
import CreateGroup from './sections/CreateGroup';
import Profile from './sections/Profile';
import Notification from './sections/Notification';
import MyGroups from './sections/MyGroups';
import RegisterAccount from './sections/RegisterAccount';
import LoginPage from './sections/loginPage';
import ProfileViewPage from './sections/ProfileViewPage';
import GroupParticipantsPage from './sections/GroupParticipantsPage';
import './index.css'
import './App.css';

function TopNav() {
  const navigate = useNavigate();
  return (
    <nav className="top-nav">
      <button onClick={() => navigate('/home')}>Home</button>
      <button onClick={() => navigate('/create-group')}>Create Group</button>
      <button onClick={() => navigate('/profile')}>Profile</button>
      <button onClick={() => navigate('/notification')}>Notification</button>
      <button onClick={() => navigate('/my-groups')}>My Groups</button>
      <button onClick={() => navigate('/login')}>Login</button>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="/register" element={<RegisterAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:userId" element={<ProfileViewPage />} />
        <Route path="/group/:groupId/participants" element={<GroupParticipantsPage />} />
      </Routes>
    </Router>
  );
}

export default App;