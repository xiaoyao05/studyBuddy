import { useNavigate } from 'react-router-dom';
import httpClient from "../httpClient";
import './TopNav.css';

function TopNav() {
  const navigate = useNavigate();
  const handlelogout = async () => {
    try {
        const resp = await httpClient.post("/api/logout");
        navigate("/");
    } catch (error) {
        if (error.response?.status === 401) {
        alert("Invalid credentials");
        }else{
        alert(error.message);
        }
    }
  }
  const handleProfile = async () => {
    try {
        const resp = await httpClient.get("/api/@me");
        navigate('/profile', { state: { userID: resp.data.id } });
    } catch (error) {
        if (error.response?.status === 401) {
        alert("Invalid credentials");
        }else{
        alert(error.message);
        }
    }
  }
  return (
    <nav className="top-nav">
       <div className="nav-buttons">
          <button onClick={() => navigate('/home')}>Home</button>
          <button onClick={() => navigate('/create-group')}>Create Group</button>
          <button onClick={() => handleProfile()}>Profile</button>
          <button onClick={() => navigate('/notification')}>Notification</button>
          <button onClick={() => navigate('/my-groups')}>My Groups</button>
          <button onClick={() => handlelogout()}>Log Out</button>
        </div>
    </nav>
  );
}

export default TopNav;